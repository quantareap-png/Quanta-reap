/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request } from 'express';
import { IAuthProvider, SessionData } from '../modules/auth/auth-provider.interface';
import { UserService } from '../modules/users/user-service';
import { User } from '../modules/users/user-types';
import { UnauthorizedError, ForbiddenError } from '../../lib/errors';
import { recordAuditEvent } from '../../lib/audit';
import { createLogger } from '../../lib/logger';

const logger = createLogger('AuthMiddleware');

export interface AuthenticatedUserContext {
  user: User;
  session: SessionData;
}

export function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

/**
 * Validates the session from the Authorization header and resolves the active user.
 * Throws UnauthorizedError (401) if missing, invalid, or expired.
 * Throws ForbiddenError (403) if user account is SUSPENDED.
 */
export async function requireAuth(
  req: Request,
  authProvider: IAuthProvider,
  userService: UserService
): Promise<AuthenticatedUserContext> {
  const token = extractBearerToken(req);
  if (!token) {
    logger.debug('Unauthenticated request rejected', { path: req.path, method: req.method });
    throw new UnauthorizedError('Authentication session required');
  }

  const session = await authProvider.validateSession(token);
  if (!session) {
    logger.debug('Session token expired or not found', { path: req.path });
    throw new UnauthorizedError('Session is invalid or has expired');
  }

  const user = await userService.getUserById(session.userId);
  if (!user) {
    logger.debug('User associated with session not found', { userId: session.userId });
    throw new UnauthorizedError('User account not found');
  }

  if (user.status !== 'ACTIVE') {
    logger.warn('Suspended user attempted access', { userId: user.id, email: user.email, status: user.status });
    recordAuditEvent('ACCESS_DENIED', {
      userId: user.id,
      details: { reason: `User account is ${user.status}`, status: user.status },
    });
    throw new ForbiddenError('Your account has been suspended. Please contact support.');
  }

  return { user, session };
}
