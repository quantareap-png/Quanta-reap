/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Runtime demo/seed data is intentionally disabled.
 *
 * Quanta must start as a completely new application with no
 * businesses, users, customers, memberships, or sample data.
 */

import { DynamoDBDataAccessLayer } from './dynamodb-interface';
import { UserService } from '../server/modules/users/user-service';
import { BusinessService } from '../server/modules/businesses/business-service';
import { CustomerService } from '../server/modules/customers/customer-service';
import { IAuthProvider } from '../server/modules/auth/auth-provider.interface';

export interface SeedAccount {
  name: string;
  email: string;
  password: string;
  role:
    | 'platform_admin'
    | 'business_owner'
    | 'business_manager'
    | 'business_staff';
  businessName: string;
  businessId: string;
  businessSlug: string;
  status: 'ACTIVE' | 'SUSPENDED';
  description: string;
}

/**
 * No runtime demo accounts.
 *
 * Keep automated test accounts inside test fixtures only.
 */
export const DEMO_ACCOUNTS: SeedAccount[] = [];

let seeded = false;

/**
 * Resets the internal seed flag.
 */
export function resetSeededFlag(): void {
  seeded = false;
}

/**
 * Runtime seeding is intentionally disabled.
 *
 * This function is retained so existing imports/calls do not break,
 * but it creates NO data.
 */
export async function seedDemoData(
  _db: DynamoDBDataAccessLayer,
  _userService: UserService,
  _businessService: BusinessService,
  _authProvider: IAuthProvider,
  _customerService?: CustomerService
): Promise<void> {
  if (seeded) {
    return;
  }

  // IMPORTANT:
  // Do not create demo/sample data here.
  //
  // No businesses
  // No users
  // No memberships
  // No customers
  // No loyalty programs
  // No points
  // No purchases
  // No rewards
  // No redemptions
  //
  // Real data must be created through the actual application.

  seeded = true;
}