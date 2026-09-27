/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IAuthProvider, SessionData } from './auth-provider.interface';
import { createLogger } from '../../../lib/logger';

const logger = createLogger('CognitoAuthProvider');

/**
 * AWS Cognito Implementation stub of IAuthProvider.
 *
 * Designed to plug in for production deployments using:
 * - AWS Cognito User Pool (UserPoolId, ClientId)
 * - AWS SDK / @aws-sdk/client-cognito-identity-provider
 * - JWT validation (aws-jwt-verify)
 *
 * In the preview environment, Quanta runs using PreviewAuthProvider.
 * This class preserves the exact abstraction contract so switching to Cognito
 * requires zero changes to business or tenant modules.
 */
export class CognitoAuthProvider implements IAuthProvider {
  readonly providerName = 'cognito';

  constructor(
    private userPoolId: string = process.env.COGNITO_USER_POOL_ID || '',
    private clientId: string = process.env.COGNITO_CLIENT_ID || ''
  ) {}

  isConfigured(): boolean {
    return Boolean(this.userPoolId && this.clientId);
  }

  async hashPassword(): Promise<{ hash: string; salt: string }> {
    throw new Error('Cognito manages password hashing internally via SRP/AdminCreateUser.');
  }

  async verifyPassword(): Promise<boolean> {
    throw new Error('Cognito manages credential verification via InitiateAuth.');
  }

  async createSession(): Promise<SessionData> {
    throw new Error('Cognito sessions are issued via Cognito tokens (ID Token / Access Token).');
  }

  async validateSession(): Promise<SessionData | null> {
    if (!this.isConfigured()) {
      logger.warn('CognitoAuthProvider called but AWS Cognito is not configured in this environment.');
      return null;
    }
    // In production, verify JWT via cognitoJwtVerifier.verify(token)
    return null;
  }

  async invalidateSession(): Promise<boolean> {
    // In production, call GlobalSignOut or RevokeToken
    return true;
  }
}
