/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * DynamoDB Single-Table Access Patterns for Quanta
 *
 * | Entity           | PK                       | SK                             | GSI1PK         | GSI1SK                 | Access Pattern / Use Case                |
 * |------------------|--------------------------|--------------------------------|----------------|------------------------|------------------------------------------|
 * | User Profile     | USER#{userId}            | PROFILE                        | USER           | EMAIL#{email}          | Get user by ID / Scan users              |
 * | Email Unique     | USER_EMAIL#{email}       | USER                           | -              | -                      | Conditional check: Unique email          |
 * | Business Meta    | BIZ#{businessId}         | METADATA                       | BIZ            | SLUG#{slug}            | Get business by ID / lookup by slug      |
 * | Slug Unique      | BIZ_SLUG#{slug}          | BIZ                            | -              | -                      | Conditional check: Unique slug           |
 * | Membership       | USER#{userId}            | MEMBERSHIP#BIZ#{businessId}    | BIZ#{businessId}| MEMBER#USER#{userId}  | User -> Memberships / Business -> Users  |
 * | Active Session   | SESSION#{token}          | SESSION                        | USER#{userId}  | SESSION#{createdAt}    | Validate / Invalidate active user session|
 * | Audit Log        | AUDIT                    | EVENT#{timestamp}#{eventId}    | -              | -                      | Chronological audit log stream           |
 */

export const KeyPatterns = {
  user: {
    pk: (userId: string) => `USER#${userId}`,
    sk: () => 'PROFILE',
  },
  userEmail: {
    pk: (email: string) => `USER_EMAIL#${email.toLowerCase().trim()}`,
    sk: () => 'USER',
  },
  business: {
    pk: (businessId: string) => `BIZ#${businessId}`,
    sk: () => 'METADATA',
  },
  businessSlug: {
    pk: (slug: string) => `BIZ_SLUG#${slug.toLowerCase().trim()}`,
    sk: () => 'BIZ',
  },
  membership: {
    // User -> Memberships query
    pk: (userId: string) => `USER#${userId}`,
    sk: (businessId: string) => `MEMBERSHIP#BIZ#${businessId}`,
    skPrefix: () => 'MEMBERSHIP#BIZ#',
    // Business -> Users GSI query
    gsi1pk: (businessId: string) => `BIZ#${businessId}`,
    gsi1sk: (userId: string) => `MEMBER#USER#${userId}`,
    gsi1skPrefix: () => 'MEMBER#USER#',
  },
  session: {
    pk: (token: string) => `SESSION#${token}`,
    sk: () => 'SESSION',
  },
  audit: {
    pk: () => 'AUDIT',
    sk: (timestamp: string, id: string) => `EVENT#${timestamp}#${id}`,
  },
  customer: {
    // Primary customer record: PK = BIZ#<businessId>, SK = CUST#<customerId>
    pk: (businessId: string) => `BIZ#${businessId}`,
    sk: (customerId: string) => `CUST#${customerId}`,
    skPrefix: () => 'CUST#',
    // Secondary lookup by normalized phone scoped to business: GSI1PK = BIZ#<businessId>, GSI1SK = PHONE#<phone>
    gsi1pk: (businessId: string) => `BIZ#${businessId}`,
    gsi1sk: (normalizedPhone: string) => `PHONE#${normalizedPhone}`,
    gsi1skPrefix: () => 'PHONE#',
  },
  customerPhone: {
    // Tenant-isolated unique phone constraint record: PK = BIZ#<businessId>#PHONE#<normalizedPhone>, SK = CLAIM
    pk: (businessId: string, normalizedPhone: string) => `BIZ#${businessId}#PHONE#${normalizedPhone}`,
    sk: () => 'CLAIM',
  },
};
