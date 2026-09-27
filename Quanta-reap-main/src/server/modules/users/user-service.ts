/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DynamoDBDataAccessLayer } from '../../../db/dynamodb-interface';
import { KeyPatterns } from '../../../db/access-patterns';
import { config } from '../../../config/app-config';
import { User, UserWithCredentials, CreateUserInput, UserStatus } from './user-types';
import { ConflictError, NotFoundError } from '../../../lib/errors';
import { createLogger } from '../../../lib/logger';

const logger = createLogger('UserService');

export class UserService {
  constructor(private db: DynamoDBDataAccessLayer, private tableName: string = config.dynamodb.tableName) {}

  public sanitize(user: UserWithCredentials | User): User {
    const { id, email, name, status, createdAt, updatedAt } = user;
    return { id, email, name, status, createdAt, updatedAt };
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const normalizedEmail = input.email.toLowerCase().trim();
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();

    const userRecord: UserWithCredentials = {
      id: userId,
      email: normalizedEmail,
      name: input.name.trim(),
      status: input.status || 'ACTIVE',
      passwordHash: input.passwordHash,
      salt: input.salt,
      createdAt: now,
      updatedAt: now,
    };

    // 1. Claim unique email with conditional check
    const emailKey = KeyPatterns.userEmail.pk(normalizedEmail);
    try {
      await this.db.putItem({
        TableName: this.tableName,
        Item: {
          PK: emailKey,
          SK: KeyPatterns.userEmail.sk(),
          userId,
          createdAt: now,
        },
        ConditionExpression: 'attribute_not_exists(PK)',
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'ConditionalCheckFailedException' || (err as Error).message?.includes('already exists')) {
        logger.warn('Duplicate registration attempt for email', { email: normalizedEmail });
        throw new ConflictError('A user with this email address already exists');
      }
      throw err;
    }

    // 2. Put main user record
    await this.db.putItem({
      TableName: this.tableName,
      Item: {
        PK: KeyPatterns.user.pk(userId),
        SK: KeyPatterns.user.sk(),
        GSI1PK: 'USER',
        GSI1SK: `EMAIL#${normalizedEmail}`,
        ...userRecord,
      },
    });

    logger.info('User created successfully', { userId, email: normalizedEmail });
    return this.sanitize(userRecord);
  }

  async getUserById(userId: string): Promise<User | null> {
    const res = await this.db.getItem<UserWithCredentials & { PK: string; SK: string }>({
      TableName: this.tableName,
      Key: {
        PK: KeyPatterns.user.pk(userId),
        SK: KeyPatterns.user.sk(),
      },
    });

    if (!res.Item) return null;
    return this.sanitize(res.Item);
  }

  async getUserWithCredentialsByEmail(email: string): Promise<UserWithCredentials | null> {
    const normalizedEmail = email.toLowerCase().trim();
    // Lookup userId via email pointer
    const emailLookup = await this.db.getItem<{ userId: string }>({
      TableName: this.tableName,
      Key: {
        PK: KeyPatterns.userEmail.pk(normalizedEmail),
        SK: KeyPatterns.userEmail.sk(),
      },
    });

    if (!emailLookup.Item) return null;

    const res = await this.db.getItem<UserWithCredentials>({
      TableName: this.tableName,
      Key: {
        PK: KeyPatterns.user.pk(emailLookup.Item.userId),
        SK: KeyPatterns.user.sk(),
      },
    });

    return res.Item || null;
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<User> {
    const existing = await this.getUserById(userId);
    if (!existing) {
      throw new NotFoundError(`User ${userId}`);
    }

    const now = new Date().toISOString();
    await this.db.updateItem({
      TableName: this.tableName,
      Key: {
        PK: KeyPatterns.user.pk(userId),
        SK: KeyPatterns.user.sk(),
      },
      UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedAt': now,
      },
    });

    return {
      ...existing,
      status,
      updatedAt: now,
    };
  }

  async updatePassword(userId: string, passwordHash: string, salt: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db.updateItem({
      TableName: this.tableName,
      Key: {
        PK: KeyPatterns.user.pk(userId),
        SK: KeyPatterns.user.sk(),
      },
      UpdateExpression: 'SET #passwordHash = :hash, #salt = :salt, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#passwordHash': 'passwordHash',
        '#salt': 'salt',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':hash': passwordHash,
        ':salt': salt,
        ':updatedAt': now,
      },
    });
  }
}
