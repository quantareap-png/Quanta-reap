/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createLogger } from '../lib/logger';
import { DynamoDBDataAccessLayer } from './dynamodb-interface';
import { UserService } from '../server/modules/users/user-service';
import { BusinessService } from '../server/modules/businesses/business-service';
import { CustomerService } from '../server/modules/customers/customer-service';
import { IAuthProvider } from '../server/modules/auth/auth-provider.interface';

const logger = createLogger('SeedData');

export interface SeedAccount {
  name: string;
  email: string;
  password: string;
  role: 'platform_admin' | 'business_owner' | 'business_manager' | 'business_staff';
  businessName: string;
  businessId: string;
  businessSlug: string;
  status: 'ACTIVE' | 'SUSPENDED';
  description: string;
}

export const DEMO_ACCOUNTS: SeedAccount[] = [];

let seeded = false;

export function resetSeededFlag(): void {
  seeded = false;
}

export async function seedDemoData(
  _db: DynamoDBDataAccessLayer,
  _userService: UserService,
  _businessService: BusinessService,
  _authProvider: IAuthProvider,
  _customerService?: CustomerService
): Promise<void> {
  if (seeded) return;

  logger.info('Runtime demo seeding is disabled. The application starts empty until a real authenticated user creates data.');
  seeded = true;
}

