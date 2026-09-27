/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User } from '../modules/users/user-types';
import { Business, BusinessMembership, Role } from '../modules/businesses/business-types';
import { BusinessService } from '../modules/businesses/business-service';
import { SessionData } from '../modules/auth/auth-provider.interface';
import { ForbiddenError, NotFoundError } from '../../lib/errors';
import { recordAuditEvent } from '../../lib/audit';
import { createLogger } from '../../lib/logger';

const logger = createLogger('TenantMiddleware');

export interface TenantContext {
  userId: string;
  businessId: string;
  role: Role;
  user: User;
  business: Business;
  membership: BusinessMembership;
}

/**
 * Resolves the tenant context for an authenticated user.
 * 1. Checks if user is authorized for the target business.
 * 2. If targetBusinessId is provided, validates explicit membership.
 * 3. If targetBusinessId is not provided, uses session activeBusinessId or default active membership.
 * 4. Strictly checks membership status === 'ACTIVE'.
 * 5. Rejects any cross-tenant or unauthorized attempt with 403 Forbidden.
 */
export async function requireBusinessAccess(
  user: User,
  businessService: BusinessService,
  targetBusinessId: string | undefined,
  requestPath?: string
): Promise<TenantContext> {
  if (!targetBusinessId) {
    throw new ForbiddenError('Business context is required');
  }

  // 1. Resolve membership directly from the data layer for this (userId, businessId)
  const membership = await businessService.getMembership(user.id, targetBusinessId);

  if (!membership) {
    logger.warn('Cross-tenant access attempt blocked: user has no membership in requested business', {
      userId: user.id,
      userEmail: user.email,
      attemptedBusinessId: targetBusinessId,
      path: requestPath,
    });

    recordAuditEvent('ACCESS_DENIED', {
      userId: user.id,
      businessId: targetBusinessId,
      details: {
        reason: 'CROSS_TENANT_ACCESS_DENIED',
        userEmail: user.email,
        attemptedBusinessId: targetBusinessId,
        path: requestPath,
      },
    });

    throw new ForbiddenError(`Access denied: you are not a member of business ${targetBusinessId}`);
  }

  if (membership.status !== 'ACTIVE') {
    logger.warn('Membership suspended access attempt blocked', {
      userId: user.id,
      businessId: targetBusinessId,
      status: membership.status,
    });

    recordAuditEvent('ACCESS_DENIED', {
      userId: user.id,
      businessId: targetBusinessId,
      details: {
        reason: 'MEMBERSHIP_SUSPENDED',
        membershipStatus: membership.status,
      },
    });

    throw new ForbiddenError(`Your membership in this business is currently ${membership.status}`);
  }

  // 2. Fetch business metadata
  const business = await businessService.getBusinessById(targetBusinessId);
  if (!business || business.status !== 'ACTIVE') {
    throw new NotFoundError('Business');
  }

  return {
    userId: user.id,
    businessId: targetBusinessId,
    role: membership.role,
    user,
    business,
    membership,
  };
}

/**
 * Resolves default active tenant context for the user session.
 */
export async function resolveTenantContext(
  user: User,
  session: SessionData,
  businessService: BusinessService,
  preferredBusinessId?: string
): Promise<TenantContext> {
  const targetId = preferredBusinessId || session.activeBusinessId;

  if (targetId) {
    return requireBusinessAccess(user, businessService, targetId);
  }

  // If no target provided, pick the user's first active membership
  const memberships = await businessService.getUserMemberships(user.id);
  const active = memberships.find(m => m.membershipStatus === 'ACTIVE');

  if (!active) {
    throw new ForbiddenError('No active business membership found for this account');
  }

  return requireBusinessAccess(user, businessService, active.id);
}

/**
 * Enforces role-based permissions within the resolved tenant context.
 */
export function requireRole(currentRole: Role, allowedRoles: Role[]): void {
  if (!allowedRoles.includes(currentRole)) {
    logger.warn('Insufficient role privileges', { currentRole, allowedRoles });
    throw new ForbiddenError(`Insufficient permissions. Required one of: [${allowedRoles.join(', ')}], current: ${currentRole}`);
  }
}
