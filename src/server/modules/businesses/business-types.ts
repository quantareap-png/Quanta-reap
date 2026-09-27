/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'platform_admin' | 'business_owner' | 'business_manager' | 'business_staff';
export type BusinessStatus = 'ACTIVE' | 'SUSPENDED';

export interface Business {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  timezone: string;
  currency: string;
  status: BusinessStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessMembership {
  id: string;
  userId: string;
  businessId: string;
  role: Role;
  status: BusinessStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessInput {
  name: string;
  slug?: string;
  businessType: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
  currency?: string;
  status?: BusinessStatus;
}

export interface CreateMembershipInput {
  userId: string;
  businessId: string;
  role: Role;
  status?: BusinessStatus;
}

export interface BusinessWithRole extends Business {
  role: Role;
  membershipId: string;
  membershipStatus: BusinessStatus;
}
