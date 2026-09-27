/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DynamoDBDataAccessLayer } from '../../../db/dynamodb-interface';
import { KeyPatterns } from '../../../db/access-patterns';
import { config } from '../../../config/app-config';
import {
  Business,
  BusinessMembership,
  CreateBusinessInput,
  CreateMembershipInput,
  BusinessWithRole,
} from './business-types';
import { ConflictError, NotFoundError } from '../../../lib/errors';
import { createLogger } from '../../../lib/logger';

const logger = createLogger('BusinessService');

export class BusinessService {
  constructor(private db: DynamoDBDataAccessLayer, private tableName: string = config.dynamodb.tableName) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'biz';
  }

  async createBusiness(input: CreateBusinessInput): Promise<Business> {
    const businessId = `biz_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const baseSlug = input.slug ? this.slugify(input.slug) : this.slugify(input.name);
    const now = new Date().toISOString();

    const business: Business = {
      id: businessId,
      name: input.name.trim(),
      slug: baseSlug,
      businessType: input.businessType.trim(),
      phone: input.phone?.trim(),
      email: input.email?.toLowerCase().trim(),
      address: input.address?.trim(),
      city: input.city?.trim(),
      state: input.state?.trim(),
      country: input.country || 'India',
      timezone: input.timezone || config.defaults.timezone,
      currency: input.currency || config.defaults.currency,
      status: input.status || config.defaults.status,
      createdAt: now,
      updatedAt: now,
    };

    // 1. Conditional claim on slug to prevent duplicate business slug
    const slugKey = KeyPatterns.businessSlug.pk(business.slug);
    try {
      await this.db.putItem({
        TableName: this.tableName,
        Item: {
          PK: slugKey,
          SK: KeyPatterns.businessSlug.sk(),
          businessId,
          createdAt: now,
        },
        ConditionExpression: 'attribute_not_exists(PK)',
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'ConditionalCheckFailedException' || (err as Error).message?.includes('already exists')) {
        logger.warn('Duplicate business slug conflict', { slug: business.slug });
        throw new ConflictError(`A business with slug "${business.slug}" already exists`);
      }
      throw err;
    }

    // 2. Put main business record
    await this.db.putItem({
      TableName: this.tableName,
      Item: {
        PK: KeyPatterns.business.pk(businessId),
        SK: KeyPatterns.business.sk(),
        GSI1PK: 'BIZ',
        GSI1SK: `SLUG#${business.slug}`,
        ...business,
      },
    });

    logger.info('Business created successfully', { businessId, name: business.name, slug: business.slug });
    return business;
  }

  async getBusinessById(businessId: string): Promise<Business | null> {
    const res = await this.db.getItem<Business & { PK: string; SK: string }>({
      TableName: this.tableName,
      Key: {
        PK: KeyPatterns.business.pk(businessId),
        SK: KeyPatterns.business.sk(),
      },
    });

    if (!res.Item) return null;
    const { id, name, slug, businessType, phone, email, address, city, state, country, timezone, currency, status, createdAt, updatedAt } = res.Item;
    return { id, name, slug, businessType, phone, email, address, city, state, country, timezone, currency, status, createdAt, updatedAt };
  }

  async createMembership(input: CreateMembershipInput): Promise<BusinessMembership> {
    const membershipId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();

    const membership: BusinessMembership = {
      id: membershipId,
      userId: input.userId,
      businessId: input.businessId,
      role: input.role,
      status: input.status || 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    // Conditional put to prevent duplicate active membership for same user in same business
    const pk = KeyPatterns.membership.pk(input.userId);
    const sk = KeyPatterns.membership.sk(input.businessId);

    try {
      await this.db.putItem({
        TableName: this.tableName,
        Item: {
          PK: pk,
          SK: sk,
          GSI1PK: KeyPatterns.membership.gsi1pk(input.businessId),
          GSI1SK: KeyPatterns.membership.gsi1sk(input.userId),
          ...membership,
        },
        ConditionExpression: 'attribute_not_exists(PK)',
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'ConditionalCheckFailedException' || (err as Error).message?.includes('already exists')) {
        logger.warn('Duplicate membership attempt rejected', { userId: input.userId, businessId: input.businessId });
        throw new ConflictError('User already has a membership in this business');
      }
      throw err;
    }

    logger.info('Membership created successfully', {
      membershipId,
      userId: input.userId,
      businessId: input.businessId,
      role: input.role,
    });

    return membership;
  }

  async getMembership(userId: string, businessId: string): Promise<BusinessMembership | null> {
    const res = await this.db.getItem<BusinessMembership & { PK: string; SK: string }>({
      TableName: this.tableName,
      Key: {
        PK: KeyPatterns.membership.pk(userId),
        SK: KeyPatterns.membership.sk(businessId),
      },
    });

    if (!res.Item) return null;
    const { id, role, status, createdAt, updatedAt } = res.Item;
    return { id, userId, businessId, role, status, createdAt, updatedAt };
  }

  async getUserMemberships(userId: string): Promise<BusinessWithRole[]> {
    const res = await this.db.query<BusinessMembership>({
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': KeyPatterns.membership.pk(userId),
        ':skPrefix': KeyPatterns.membership.skPrefix(),
      },
    });

    const memberships = res.Items || [];
    const businessesWithRole: BusinessWithRole[] = [];

    for (const mem of memberships) {
      const biz = await this.getBusinessById(mem.businessId);
      if (biz) {
        businessesWithRole.push({
          ...biz,
          role: mem.role,
          membershipId: mem.id,
          membershipStatus: mem.status,
        });
      }
    }

    return businessesWithRole;
  }

  async getBusinessMembers(businessId: string): Promise<BusinessMembership[]> {
    const res = await this.db.query<BusinessMembership>({
      TableName: this.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk AND begins_with(GSI1SK, :gsi1skPrefix)',
      ExpressionAttributeValues: {
        ':gsi1pk': KeyPatterns.membership.gsi1pk(businessId),
        ':gsi1skPrefix': KeyPatterns.membership.gsi1skPrefix(),
      },
    });

    return res.Items || [];
  }

  async updateMembershipStatus(userId: string, businessId: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<BusinessMembership> {
    const existing = await this.getMembership(userId, businessId);
    if (!existing) {
      throw new NotFoundError('Membership');
    }

    const now = new Date().toISOString();
    await this.db.updateItem({
      TableName: this.tableName,
      Key: {
        PK: KeyPatterns.membership.pk(userId),
        SK: KeyPatterns.membership.sk(businessId),
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
}
