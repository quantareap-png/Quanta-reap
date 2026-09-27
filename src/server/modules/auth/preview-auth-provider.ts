/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'node:crypto';
import { IAuthProvider, SessionData } from './auth-provider.interface';
import { DynamoDBDataAccessLayer } from '../../../db/dynamodb-interface';
import { KeyPatterns } from '../../../db/access-patterns';
import { config } from '../../../config/app-config';
import { createLogger } from '../../../lib/logger';

const logger = createLogger('PreviewAuthProvider');
const PREVIEW_JWT_SECRET = process.env.SESSION_SECRET || 'quanta_preview_hmac_secret_2026';

export class PreviewAuthProvider implements IAuthProvider {
  readonly providerName = 'preview';

  constructor(
    private db: DynamoDBDataAccessLayer,
    private tableName: string = config.dynamodb.tableName,
    private sessionDurationSeconds: number = config.auth.sessionDurationSeconds
  ) {}

  async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt };
  }

  async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    try {
      const calculatedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
      return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(calculatedHash, 'hex'));
    } catch (err) {
      logger.error('Error during password verification', err);
      return false;
    }
  }

  async createSession(userId: string, activeBusinessId?: string): Promise<SessionData> {
    const sessionId = `sess_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.sessionDurationSeconds * 1000).toISOString();

    const payload = JSON.stringify({
      sId: sessionId,
      uId: userId,
      bId: activeBusinessId || '',
      iat: now.toISOString(),
      exp: expiresAt,
    });
    const payloadB64 = Buffer.from(payload).toString('base64url');
    const hmac = crypto.createHmac('sha256', PREVIEW_JWT_SECRET).update(payloadB64).digest('base64url');
    const token = `qt_${payloadB64}.${hmac}`;

    const sessionData: SessionData = {
      sessionId,
      token,
      userId,
      activeBusinessId,
      createdAt: now.toISOString(),
      expiresAt,
    };

    await this.db.putItem({
      TableName: this.tableName,
      Item: {
        PK: KeyPatterns.session.pk(token),
        SK: KeyPatterns.session.sk(),
        GSI1PK: `USER#${userId}`,
        GSI1SK: `SESSION#${sessionData.createdAt}`,
        ...sessionData,
      },
    });

    logger.debug('Session created', { userId, activeBusinessId, sessionId });
    return sessionData;
  }

  async validateSession(token: string): Promise<SessionData | null> {
    if (!token || !token.startsWith('qt_')) return null;

    // 1. Check in-memory store
    const res = await this.db.getItem<SessionData & { PK: string; SK: string }>({
      TableName: this.tableName,
      Key: {
        PK: KeyPatterns.session.pk(token),
        SK: KeyPatterns.session.sk(),
      },
    });

    if (res.Item) {
      const now = new Date().toISOString();
      if (res.Item.expiresAt < now) {
        logger.debug('Session expired', { sessionId: res.Item.sessionId });
        await this.invalidateSession(token);
        return null;
      }
      const { sessionId, userId, activeBusinessId, createdAt, expiresAt } = res.Item;
      return { sessionId, token, userId, activeBusinessId, createdAt, expiresAt };
    }

    // 2. If not found in-memory (e.g. server restarted), verify HMAC token
    const dotIndex = token.indexOf('.');
    if (dotIndex > 3) {
      try {
        const payloadB64 = token.substring(3, dotIndex);
        const signature = token.substring(dotIndex + 1);
        const expectedSig = crypto.createHmac('sha256', PREVIEW_JWT_SECRET).update(payloadB64).digest('base64url');

        if (
          signature.length === expectedSig.length &&
          crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))
        ) {
          const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
          const now = new Date().toISOString();
          if (payload.exp && payload.exp > now) {
            const restoredSession: SessionData = {
              sessionId: payload.sId,
              token,
              userId: payload.uId,
              activeBusinessId: payload.bId || undefined,
              createdAt: payload.iat,
              expiresAt: payload.exp,
            };
            // Cache back into memory store
            await this.db.putItem({
              TableName: this.tableName,
              Item: {
                PK: KeyPatterns.session.pk(token),
                SK: KeyPatterns.session.sk(),
                GSI1PK: `USER#${restoredSession.userId}`,
                GSI1SK: `SESSION#${restoredSession.createdAt}`,
                ...restoredSession,
              },
            });
            return restoredSession;
          }
        }
      } catch {
        // Invalid or expired token format
      }
    }

    return null;
  }

  async invalidateSession(token: string): Promise<boolean> {
    if (!token) return false;

    await this.db.deleteItem({
      TableName: this.tableName,
      Key: {
        PK: KeyPatterns.session.pk(token),
        SK: KeyPatterns.session.sk(),
      },
    });

    logger.info('Session invalidated successfully');
    return true;
  }

  async switchActiveBusiness(token: string, newBusinessId: string): Promise<SessionData | null> {
    const session = await this.validateSession(token);
    if (!session) return null;

    session.activeBusinessId = newBusinessId;

    await this.db.updateItem({
      TableName: this.tableName,
      Key: {
        PK: KeyPatterns.session.pk(token),
        SK: KeyPatterns.session.sk(),
      },
      UpdateExpression: 'SET #activeBusinessId = :newBiz',
      ExpressionAttributeNames: {
        '#activeBusinessId': 'activeBusinessId',
      },
      ExpressionAttributeValues: {
        ':newBiz': newBusinessId,
      },
    });

    return session;
  }
}
