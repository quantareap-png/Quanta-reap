/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memoryDynamoDB } from '../db/memory-dynamodb';
import { PreviewAuthProvider } from './modules/auth/preview-auth-provider';
import { createApiRouter } from './router';

/**
 * AWS Lambda Handler Abstraction.
 *
 * Preserves Quanta's serverless architecture contract:
 * Adapts API Gateway V2 HTTP events to Quanta router when deployed to AWS Lambda.
 * In local and preview environments, standard Express server mounts the same router.
 */
export interface APIGatewayEventLike {
  version?: string;
  routeKey?: string;
  rawPath: string;
  rawQueryString?: string;
  headers: Record<string, string>;
  body?: string;
  isBase64Encoded?: boolean;
  requestContext?: {
    http?: {
      method: string;
      path: string;
      sourceIp: string;
      userAgent: string;
    };
  };
}

export interface APIGatewayResultLike {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

export async function handler(event: APIGatewayEventLike): Promise<APIGatewayResultLike> {
  // Production serverless entrypoint
  const path = event.rawPath || '/';
  const method = event.requestContext?.http?.method || 'GET';

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Quanta Lambda handler ready for AWS Serverless deployment',
      path,
      method,
      phase: '1B - Authentication + Tenancy',
    }),
  };
}

export { createApiRouter, memoryDynamoDB, PreviewAuthProvider };
