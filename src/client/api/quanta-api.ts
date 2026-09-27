/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const TOKEN_KEY = 'quanta_session_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // localStorage might fail in restricted iframe mode
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data?.error?.message || data?.message || `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    (err as unknown as { status: number; code?: string; details?: unknown }).status = res.status;
    (err as unknown as { status: number; code?: string; details?: unknown }).code = data?.error?.code;
    (err as unknown as { status: number; code?: string; details?: unknown }).details = data?.error?.details;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
  register: (body: { name: string; email: string; password: string; businessName: string; businessType: string }) =>
    request<{ success: boolean; token: string; user: any; business: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<{ success: boolean; token: string; user: any; businesses: any[]; currentBusiness: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  logout: () =>
    request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () =>
    request<{ success: boolean; user: any; businesses: any[]; currentBusiness: any }>('/auth/me'),

  switchBusiness: (businessId: string) =>
    request<{ success: boolean; currentBusiness: any }>('/auth/switch-business', {
      method: 'POST',
      body: JSON.stringify({ businessId }),
    }),

  // Businesses & Tenancy
  getBusinesses: () =>
    request<{ success: boolean; businesses: any[] }>('/businesses'),

  createBusiness: (body: { name: string; businessType: string; phone?: string; email?: string }) =>
    request<{ success: boolean; business: any }>('/businesses', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getBusiness: (businessId: string) =>
    request<{ success: boolean; business: any; role: string; membership: any }>(`/businesses/${businessId}`),

  getBusinessData: (businessId: string) =>
    request<{ success: boolean; businessId: string; businessName: string; role: string; isolatedData: any }>(
      `/businesses/${businessId}/data`
    ),

  addMember: (businessId: string, body: { email: string; role: string }) =>
    request<{ success: boolean; membership: any; user: any }>(`/businesses/${businessId}/members`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Phase 1C: Customers
  getCustomers: (params: { search?: string; status?: string; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.limit) query.append('limit', String(params.limit));
    const qs = query.toString();
    return request<{ success: boolean; businessId: string; count: number; customers: any[] }>(
      `/customers${qs ? `?${qs}` : ''}`
    );
  },

  lookupCustomerByPhone: (phone: string) =>
    request<{ success: boolean; customers: any[] }>(`/customers/lookup?phone=${encodeURIComponent(phone)}`),

  getCustomer: (id: string) =>
    request<{ success: boolean; customer: any }>(`/customers/${id}`),

  createCustomer: (body: {
    name: string;
    phone: string;
    email?: string;
    dateOfBirth?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    tags?: string[];
    notes?: string;
  }) =>
    request<{ success: boolean; customer: any }>('/customers', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateCustomer: (
    id: string,
    body: {
      name?: string;
      phone?: string;
      email?: string;
      dateOfBirth?: string;
      status?: 'ACTIVE' | 'INACTIVE';
      tags?: string[];
      notes?: string;
    }
  ) =>
    request<{ success: boolean; customer: any }>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  activateCustomer: (id: string) =>
    request<{ success: boolean; customer: any }>(`/customers/${id}/activate`, {
      method: 'POST',
    }),

  deactivateCustomer: (id: string) =>
    request<{ success: boolean; customer: any }>(`/customers/${id}/deactivate`, {
      method: 'POST',
    }),

  // Diagnostics & Tests
  getHealth: () => request<any>('/diagnostics/health'),
  getAuditLogs: () => request<{ success: boolean; logs: any[] }>('/diagnostics/audit-logs'),
  runTests: () => request<any>('/tests/run', { method: 'POST' }),
};
