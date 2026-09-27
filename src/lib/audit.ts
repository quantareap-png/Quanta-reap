/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createLogger } from './logger';

const logger = createLogger('Audit');

export type AuditEventType =
  | 'USER_REGISTERED'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'BUSINESS_CREATED'
  | 'MEMBERSHIP_CREATED'
  | 'CUSTOMER_CREATED'
  | 'CUSTOMER_UPDATED'
  | 'CUSTOMER_ACTIVATED'
  | 'CUSTOMER_DEACTIVATED'
  | 'AUTHENTICATION_FAILED'
  | 'ACCESS_DENIED';

export interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  timestamp: string;
  userId?: string;
  businessId?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

const auditBuffer: AuditEvent[] = [];
const MAX_AUDIT_BUFFER = 200;

export function recordAuditEvent(
  eventType: AuditEventType,
  data: {
    userId?: string;
    businessId?: string;
    ip?: string;
    userAgent?: string;
    details?: Record<string, unknown>;
  }
): AuditEvent {
  const event: AuditEvent = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    eventType,
    timestamp: new Date().toISOString(),
    userId: data.userId,
    businessId: data.businessId,
    ip: data.ip,
    userAgent: data.userAgent,
    details: data.details,
  };

  auditBuffer.push(event);
  if (auditBuffer.length > MAX_AUDIT_BUFFER) {
    auditBuffer.shift();
  }

  logger.debug(`AUDIT: ${eventType}`, {
    auditId: event.id,
    userId: event.userId,
    businessId: event.businessId,
    ...event.details,
  });

  return event;
}

export function getRecentAuditEvents(): AuditEvent[] {
  return [...auditBuffer].reverse();
}
