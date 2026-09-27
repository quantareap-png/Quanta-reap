/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DynamoDBDataAccessLayer } from './dynamodb-interface';
import { UserService } from '../server/modules/users/user-service';
import { BusinessService } from '../server/modules/businesses/business-service';
import { CustomerService } from '../server/modules/customers/customer-service';
import { IAuthProvider } from '../server/modules/auth/auth-provider.interface';
import { createLogger } from '../lib/logger';
import { config } from '../config/app-config';

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

export const DEMO_ACCOUNTS: SeedAccount[] = [
  {
    name: 'Quanta Developer',
    email: 'quantareap@gmail.com',
    password: 'Password123!',
    role: 'business_owner',
    businessName: 'Demo Cafe A',
    businessId: 'biz_cafe_a',
    businessSlug: 'demo-cafe-a',
    status: 'ACTIVE',
    description: 'Owner & Developer Account (quantareap@gmail.com)',
  },
  {
    name: 'Alice Owner',
    email: 'alice@example.test',
    password: 'Password123!',
    role: 'business_owner',
    businessName: 'Demo Cafe A',
    businessId: 'biz_cafe_a',
    businessSlug: 'demo-cafe-a',
    status: 'ACTIVE',
    description: 'Owner of Demo Cafe A (Full business control)',
  },
  {
    name: 'Bob Owner',
    email: 'bob@example.test',
    password: 'Password123!',
    role: 'business_owner',
    businessName: 'Demo Cafe B',
    businessId: 'biz_cafe_b',
    businessSlug: 'demo-cafe-b',
    status: 'ACTIVE',
    description: 'Owner of Demo Cafe B (Full business control)',
  },
  {
    name: 'Charlie Manager',
    email: 'charlie@example.test',
    password: 'Password123!',
    role: 'business_manager',
    businessName: 'Demo Cafe A',
    businessId: 'biz_cafe_a',
    businessSlug: 'demo-cafe-a',
    status: 'ACTIVE',
    description: 'Manager at Demo Cafe A (Operational permissions)',
  },
  {
    name: 'Diana Staff',
    email: 'diana@example.test',
    password: 'Password123!',
    role: 'business_staff',
    businessName: 'Demo Cafe A',
    businessId: 'biz_cafe_a',
    businessSlug: 'demo-cafe-a',
    status: 'ACTIVE',
    description: 'Staff member at Demo Cafe A (Staff permissions)',
  },
  {
    name: 'Eve Suspended',
    email: 'eve@example.test',
    password: 'Password123!',
    role: 'business_staff',
    businessName: 'Demo Cafe A',
    businessId: 'biz_cafe_a',
    businessSlug: 'demo-cafe-a',
    status: 'SUSPENDED',
    description: 'Suspended staff member (Access denied by policy)',
  },
  {
    name: 'Platform Admin',
    email: 'admin@quanta.test',
    password: 'AdminPassword123!',
    role: 'platform_admin',
    businessName: 'Quanta Platform',
    businessId: 'biz_platform',
    businessSlug: 'quanta-platform',
    status: 'ACTIVE',
    description: 'System-wide administrator (Platform level)',
  },
];

let seeded = false;

export function resetSeededFlag(): void {
  seeded = false;
}

export async function seedDemoData(
  db: DynamoDBDataAccessLayer,
  userService: UserService,
  businessService: BusinessService,
  authProvider: IAuthProvider,
  customerService?: CustomerService
): Promise<void> {
  if (seeded) return;

  const tableName = config.dynamodb.tableName;
  logger.info(`Seeding demo businesses, users, and memberships into table "${tableName}"...`);

  // 1. Seed Business A
  const bizA = await businessService.getBusinessById('biz_cafe_a');
  if (!bizA) {
    await db.putItem({
      TableName: tableName,
      Item: {
        PK: 'BIZ#biz_cafe_a',
        SK: 'METADATA',
        GSI1PK: 'BIZ',
        GSI1SK: 'SLUG#demo-cafe-a',
        id: 'biz_cafe_a',
        name: 'Demo Cafe A',
        slug: 'demo-cafe-a',
        businessType: 'Restaurant & Bakery',
        phone: '+91 98765 43210',
        email: 'contact@cafe-a.test',
        address: '100 MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    await db.putItem({
      TableName: tableName,
      Item: {
        PK: 'BIZ_SLUG#demo-cafe-a',
        SK: 'BIZ',
        businessId: 'biz_cafe_a',
        createdAt: new Date().toISOString(),
      },
    });
  }

  // 2. Seed Business B
  const bizB = await businessService.getBusinessById('biz_cafe_b');
  if (!bizB) {
    await db.putItem({
      TableName: tableName,
      Item: {
        PK: 'BIZ#biz_cafe_b',
        SK: 'METADATA',
        GSI1PK: 'BIZ',
        GSI1SK: 'SLUG#demo-cafe-b',
        id: 'biz_cafe_b',
        name: 'Demo Cafe B',
        slug: 'demo-cafe-b',
        businessType: 'Specialty Coffee Roasters',
        phone: '+91 98765 12345',
        email: 'hello@cafe-b.test',
        address: '42 Park Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    await db.putItem({
      TableName: tableName,
      Item: {
        PK: 'BIZ_SLUG#demo-cafe-b',
        SK: 'BIZ',
        businessId: 'biz_cafe_b',
        createdAt: new Date().toISOString(),
      },
    });
  }

  // 3. Seed Users and Memberships
  for (const acc of DEMO_ACCOUNTS) {
    const existing = await userService.getUserWithCredentialsByEmail(acc.email);
    let userId = existing?.id;

    if (!existing) {
      const { hash, salt } = await authProvider.hashPassword(acc.password);
      const created = await userService.createUser({
        name: acc.name,
        email: acc.email,
        passwordHash: hash,
        salt,
        status: acc.status,
      });
      userId = created.id;
    }

    if (userId) {
      // Check primary membership
      const existingMem = await businessService.getMembership(userId, acc.businessId);
      if (!existingMem) {
        await businessService.createMembership({
          userId,
          businessId: acc.businessId,
          role: acc.role,
          status: acc.status,
        });
      }

      // If this is quantareap@gmail.com, also grant access to Cafe B so multi-tenant switching works
      if (acc.email === 'quantareap@gmail.com') {
        const memB = await businessService.getMembership(userId, 'biz_cafe_b');
        if (!memB) {
          await businessService.createMembership({
            userId,
            businessId: 'biz_cafe_b',
            role: 'business_owner',
            status: 'ACTIVE',
          });
        }
      }
    }
  }

  // 4. Seed Initial Customers (Tenant Scoped)
  if (customerService) {
    // Cafe A Customers
    const cafeACustomers = [
      {
        name: 'Aarav Sharma',
        phone: '+919811122233',
        email: 'aarav.sharma@example.test',
        dateOfBirth: '1992-04-15',
        tags: ['Regular', 'Morning Club', 'Espresso'],
        notes: 'Prefers oat milk and extra hot double shot',
      },
      {
        name: 'Priya Patel',
        phone: '+919822233344',
        email: 'priya.patel@example.test',
        dateOfBirth: '1995-11-20',
        tags: ['VIP', 'Pastry Lover'],
        notes: 'Allergic to hazelnuts; loyal customer since opening',
      },
      {
        name: 'Vikram Malhotra',
        phone: '+919833344455',
        email: 'vikram.m@example.test',
        dateOfBirth: '1988-08-05',
        tags: ['Weekend Brunch'],
        notes: 'Always books the terrace corner table',
      },
      {
        name: 'Neha Kapoor',
        phone: '+919844455566',
        email: 'neha.k@example.test',
        tags: ['Tea Enthusiast'],
        notes: 'Likes Earl Grey with honey',
      },
    ];

    for (const cust of cafeACustomers) {
      const exists = await customerService.getCustomerByPhone('biz_cafe_a', cust.phone);
      if (!exists) {
        await customerService.createCustomer('biz_cafe_a', cust);
      }
    }

    // Cafe B Customers (Demonstrates same phone can exist in Cafe B as independent tenant)
    const cafeBCustomers = [
      {
        name: 'Aarav Sharma (Beach House)',
        phone: '+919811122233', // Exact same phone as Cafe A customer, completely isolated to Cafe B!
        email: 'aarav.goa@example.test',
        tags: ['Tourist', 'Sunset Session'],
        notes: 'Visits when in Goa for workations',
      },
      {
        name: 'Rohan Deshmukh',
        phone: '+919855566677',
        email: 'rohan.d@example.test',
        dateOfBirth: '1990-02-12',
        tags: ['Live Music Regular'],
        notes: 'Craft beer & sourdough pizza enthusiast',
      },
    ];

    for (const cust of cafeBCustomers) {
      const exists = await customerService.getCustomerByPhone('biz_cafe_b', cust.phone);
      if (!exists) {
        await customerService.createCustomer('biz_cafe_b', cust);
      }
    }
  }

  seeded = true;
  logger.info('Demo seed data initialized successfully.');
}
