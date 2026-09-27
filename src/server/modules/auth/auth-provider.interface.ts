/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SessionData {
  sessionId: string;
  token: string;
  userId: string;
  activeBusinessId?: string;
  createdAt: string;
  expiresAt: string;
}

export interface IAuthProvider {
  readonly providerName: string;
  hashPassword(password: string): Promise<{ hash: string; salt: string }>;
  verifyPassword(password: string, hash: string, salt: string): Promise<boolean>;
  createSession(userId: string, activeBusinessId?: string): Promise<SessionData>;
  validateSession(token: string): Promise<SessionData | null>;
  invalidateSession(token: string): Promise<boolean>;
  switchActiveBusiness?(token: string, newBusinessId: string): Promise<SessionData | null>;
}
