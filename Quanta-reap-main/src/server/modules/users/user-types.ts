/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithCredentials extends User {
  passwordHash: string;
  salt: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  status?: UserStatus;
}
