/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppConfig {
  app: {
    name: string;
    version: string;
    env: 'development' | 'preview' | 'production';
    url: string;
  };
  auth: {
    provider: 'preview' | 'cognito';
    sessionDurationSeconds: number;
    passwordMinLength: number;
  };
  dynamodb: {
    tableName: string;
    region: string;
    isEmulated: boolean;
  };
  defaults: {
    timezone: string;
    currency: string;
    status: 'ACTIVE';
  };
}

const runtimeEnv = typeof import.meta !== 'undefined' && 'env' in import.meta
  ? import.meta.env
  : (typeof process !== 'undefined' ? process.env : {});

export const config: AppConfig = {
  app: {
    name: 'Quanta',
    version: '1.0.0-1B',
    env: ((runtimeEnv.NODE_ENV as AppConfig['app']['env']) || 'development') as AppConfig['app']['env'],
    url: runtimeEnv.APP_URL || 'http://localhost:3000',
  },
  auth: {
    provider: ((runtimeEnv.AUTH_PROVIDER as 'preview' | 'cognito') || 'preview') as 'preview' | 'cognito',
    sessionDurationSeconds: 86400 * 7, // 7 days
    passwordMinLength: 8,
  },
  dynamodb: {
    tableName: runtimeEnv.DYNAMODB_TABLE_NAME || 'quanta-main',
    region: runtimeEnv.AWS_REGION || 'ap-south-1',
    isEmulated: true, // In AI Studio preview environment, in-memory DynamoDB emulation is active
  },
  defaults: {
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    status: 'ACTIVE',
  },
};
