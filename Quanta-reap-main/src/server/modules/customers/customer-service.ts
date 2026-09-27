/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DynamoDBDataAccessLayer } from '../../../db/dynamodb-interface';
import { KeyPatterns } from '../../../db/access-patterns';
import { config } from '../../../config/app-config';
import {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
  CustomerFilterQuery,
} from './customer-types';
import { ConflictError, NotFoundError, ValidationError } from '../../../lib/errors';
import { normalizePhoneNumber, getPhoneSearchDigits } from '../../../lib/phone';
import { createLogger } from '../../../lib/logger';

const logger = createLogger('CustomerService');

export class CustomerService {
  constructor(
    private db: DynamoDBDataAccessLayer,
    private tableName: string = config.dynamodb.tableName
  ) {}

  /**
   * Creates a customer strictly scoped to the authenticated business tenant.
   * Enforces tenant-isolated duplicate phone prevention using an atomic conditional write.
   */
  async createCustomer(businessId: string, input: CreateCustomerInput): Promise<Customer> {
    if (!businessId) {
      throw new ValidationError('Tenant businessId is required');
    }
    if (!input.name || !input.name.trim()) {
      throw new ValidationError('Customer name is required');
    }
    if (!input.phone || !input.phone.trim()) {
      throw new ValidationError('Customer phone number is required');
    }

    const normalizedPhone = normalizePhoneNumber(input.phone);
    if (!normalizedPhone) {
      throw new ValidationError('A valid phone number is required');
    }

    const customerId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();

    const customer: Customer = {
      id: customerId,
      businessId,
      name: input.name.trim(),
      phone: normalizedPhone,
      email: input.email ? input.email.toLowerCase().trim() : undefined,
      dateOfBirth: input.dateOfBirth?.trim() || undefined,
      status: input.status || 'ACTIVE',
      tags: Array.isArray(input.tags)
        ? input.tags.map(t => t.trim()).filter(Boolean)
        : [],
      notes: input.notes?.trim() || undefined,
      lastActivityAt: now,
      createdAt: now,
      updatedAt: now,
    };

    // 1. Conditional check on tenant-scoped phone claim to prevent duplicate in the same business
    const phoneClaimKey = KeyPatterns.customerPhone.pk(businessId, normalizedPhone);
    try {
      await this.db.putItem({
        TableName: this.tableName,
        Item: {
          PK: phoneClaimKey,
          SK: KeyPatterns.customerPhone.sk(),
          businessId,
          customerId,
          phone: normalizedPhone,
          createdAt: now,
        },
        ConditionExpression: 'attribute_not_exists(PK)',
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'ConditionalCheckFailedException' || (err as Error).message?.includes('already exists')) {
        logger.warn('Duplicate customer phone rejected for business', {
          businessId,
          phone: normalizedPhone,
        });
        throw new ConflictError(
          `A customer with phone number "${normalizedPhone}" already exists in this business`
        );
      }
      throw err;
    }

    // 2. Put main customer record: PK = BIZ#<businessId>, SK = CUST#<customerId>
    await this.db.putItem({
      TableName: this.tableName,
      Item: {
        PK: KeyPatterns.customer.pk(businessId),
        SK: KeyPatterns.customer.sk(customerId),
        GSI1PK: KeyPatterns.customer.gsi1pk(businessId),
        GSI1SK: KeyPatterns.customer.gsi1sk(normalizedPhone),
        ...customer,
      },
    });

    logger.info('Customer created successfully', {
      businessId,
      customerId,
      phone: normalizedPhone,
    });

    return customer;
  }

  /**
   * Retrieves a customer by ID strictly within the authenticated business tenant.
   * If customer exists under another tenant, returns null (or throws NotFoundError).
   */
  async getCustomerById(businessId: string, customerId: string): Promise<Customer | null> {
    if (!businessId || !customerId) return null;

    const res = await this.db.getItem<Customer & { PK: string; SK: string }>({
      TableName: this.tableName,
      Key: {
        PK: KeyPatterns.customer.pk(businessId),
        SK: KeyPatterns.customer.sk(customerId),
      },
    });

    if (!res.Item) return null;
    return this.sanitizeItem(res.Item);
  }

  /**
   * Retrieves a customer by normalized phone number strictly within the authenticated business tenant.
   */
  async getCustomerByPhone(businessId: string, rawPhone: string): Promise<Customer | null> {
    if (!businessId || !rawPhone) return null;

    const normalizedPhone = normalizePhoneNumber(rawPhone);
    if (!normalizedPhone) return null;

    // Use GSI1: GSI1PK = BIZ#<businessId>, GSI1SK = PHONE#<normalizedPhone>
    const res = await this.db.query<Customer & { PK: string; SK: string }>({
      TableName: this.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk AND GSI1SK = :gsi1sk',
      ExpressionAttributeValues: {
        ':gsi1pk': KeyPatterns.customer.gsi1pk(businessId),
        ':gsi1sk': KeyPatterns.customer.gsi1sk(normalizedPhone),
      },
      Limit: 1,
    });

    if (!res.Items || res.Items.length === 0) return null;
    return this.sanitizeItem(res.Items[0]);
  }

  /**
   * Lists and searches customers strictly scoped to the authenticated business tenant.
   * Supports search across phone (prefix/substring), customer name, and customer email.
   */
  async listCustomers(businessId: string, query: CustomerFilterQuery = {}): Promise<Customer[]> {
    if (!businessId) return [];

    // Query all customer items under this business partition: PK = BIZ#<businessId>, SK begins_with CUST#
    const res = await this.db.query<Customer & { PK: string; SK: string }>({
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': KeyPatterns.customer.pk(businessId),
        ':skPrefix': KeyPatterns.customer.skPrefix(),
      },
    });

    let customers = (res.Items || []).map(item => this.sanitizeItem(item));

    // In-memory tenant filtering & sorting
    if (query.status) {
      customers = customers.filter(c => c.status === query.status);
    }

    if (query.search && query.search.trim()) {
      const term = query.search.trim().toLowerCase();
      const termDigits = getPhoneSearchDigits(term);

      customers = customers.filter(c => {
        const nameMatch = c.name.toLowerCase().includes(term);
        const emailMatch = c.email ? c.email.toLowerCase().includes(term) : false;
        const phoneMatch = c.phone.toLowerCase().includes(term);
        const phoneDigitsMatch = termDigits.length >= 3 && getPhoneSearchDigits(c.phone).includes(termDigits);
        const tagsMatch = c.tags && c.tags.some(tag => tag.toLowerCase().includes(term));

        return nameMatch || emailMatch || phoneMatch || phoneDigitsMatch || tagsMatch;
      });
    }

    // Sort by most recent activity / created date descending
    customers.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt).getTime();
      return timeB - timeA;
    });

    if (query.limit && query.limit > 0) {
      customers = customers.slice(0, query.limit);
    }

    return customers;
  }

  /**
   * Updates customer profile within the authenticated business tenant.
   * If phone number is modified, handles tenant-scoped uniqueness swap safely.
   */
  async updateCustomer(
    businessId: string,
    customerId: string,
    input: UpdateCustomerInput
  ): Promise<Customer> {
    const existing = await this.getCustomerById(businessId, customerId);
    if (!existing) {
      throw new NotFoundError('Customer');
    }

    const now = new Date().toISOString();
    let newPhone = existing.phone;

    // Handle phone number change
    if (input.phone && input.phone.trim()) {
      const candidatePhone = normalizePhoneNumber(input.phone);
      if (candidatePhone !== existing.phone) {
        // Claim new phone under this business
        const newClaimKey = KeyPatterns.customerPhone.pk(businessId, candidatePhone);
        try {
          await this.db.putItem({
            TableName: this.tableName,
            Item: {
              PK: newClaimKey,
              SK: KeyPatterns.customerPhone.sk(),
              businessId,
              customerId,
              phone: candidatePhone,
              createdAt: now,
            },
            ConditionExpression: 'attribute_not_exists(PK)',
          });
        } catch (err: unknown) {
          const code = (err as { code?: string })?.code;
          if (code === 'ConditionalCheckFailedException' || (err as Error).message?.includes('already exists')) {
            throw new ConflictError(
              `A customer with phone number "${candidatePhone}" already exists in this business`
            );
          }
          throw err;
        }

        // Release old phone claim
        const oldClaimKey = KeyPatterns.customerPhone.pk(businessId, existing.phone);
        await this.db.deleteItem({
          TableName: this.tableName,
          Key: {
            PK: oldClaimKey,
            SK: KeyPatterns.customerPhone.sk(),
          },
        }).catch(err => {
          logger.warn('Failed to delete old phone claim', { err, oldClaimKey });
        });

        newPhone = candidatePhone;
      }
    }

    const updatedCustomer: Customer = {
      ...existing,
      name: input.name !== undefined ? input.name.trim() : existing.name,
      phone: newPhone,
      email: input.email !== undefined ? (input.email ? input.email.toLowerCase().trim() : undefined) : existing.email,
      dateOfBirth: input.dateOfBirth !== undefined ? (input.dateOfBirth?.trim() || undefined) : existing.dateOfBirth,
      status: input.status || existing.status,
      tags: input.tags !== undefined ? input.tags.map(t => t.trim()).filter(Boolean) : existing.tags,
      notes: input.notes !== undefined ? (input.notes?.trim() || undefined) : existing.notes,
      lastActivityAt: now,
      updatedAt: now,
    };

    // Update primary record
    await this.db.putItem({
      TableName: this.tableName,
      Item: {
        PK: KeyPatterns.customer.pk(businessId),
        SK: KeyPatterns.customer.sk(customerId),
        GSI1PK: KeyPatterns.customer.gsi1pk(businessId),
        GSI1SK: KeyPatterns.customer.gsi1sk(newPhone),
        ...updatedCustomer,
      },
    });

    logger.info('Customer updated successfully', { businessId, customerId });
    return updatedCustomer;
  }

  /**
   * Sets customer status to ACTIVE.
   */
  async activateCustomer(businessId: string, customerId: string): Promise<Customer> {
    return this.updateCustomer(businessId, customerId, { status: 'ACTIVE' });
  }

  /**
   * Sets customer status to INACTIVE.
   */
  async deactivateCustomer(businessId: string, customerId: string): Promise<Customer> {
    return this.updateCustomer(businessId, customerId, { status: 'INACTIVE' });
  }

  /**
   * Cleans internal DynamoDB key artifacts from the customer model.
   */
  private sanitizeItem(item: unknown): Customer {
    const {
      id,
      businessId,
      name,
      phone,
      email,
      dateOfBirth,
      status,
      tags,
      notes,
      lastActivityAt,
      createdAt,
      updatedAt,
    } = item as Customer;

    return {
      id,
      businessId,
      name,
      phone,
      email,
      dateOfBirth,
      status: status || 'ACTIVE',
      tags: Array.isArray(tags) ? tags : [],
      notes,
      lastActivityAt,
      createdAt,
      updatedAt,
    };
  }
}
