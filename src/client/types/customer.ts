/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CustomerStatus = 'ACTIVE' | 'INACTIVE';

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  status: CustomerStatus;
  tags: string[];
  notes?: string;
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerInput {
  name: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  status?: CustomerStatus;
  tags?: string[];
  notes?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  status?: CustomerStatus;
  tags?: string[];
  notes?: string;
}
