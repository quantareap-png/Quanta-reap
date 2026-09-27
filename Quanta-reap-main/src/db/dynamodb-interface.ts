/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GetItemInput {
  TableName: string;
  Key: Record<string, unknown>;
}

export interface GetItemOutput<T = Record<string, unknown>> {
  Item?: T;
}

export interface PutItemInput {
  TableName: string;
  Item: Record<string, unknown>;
  ConditionExpression?: string;
  ExpressionAttributeNames?: Record<string, string>;
  ExpressionAttributeValues?: Record<string, unknown>;
}

export interface DeleteItemInput {
  TableName: string;
  Key: Record<string, unknown>;
  ConditionExpression?: string;
  ExpressionAttributeNames?: Record<string, string>;
  ExpressionAttributeValues?: Record<string, unknown>;
}

export interface UpdateItemInput {
  TableName: string;
  Key: Record<string, unknown>;
  UpdateExpression: string;
  ConditionExpression?: string;
  ExpressionAttributeNames?: Record<string, string>;
  ExpressionAttributeValues?: Record<string, unknown>;
}

export interface QueryInput {
  TableName: string;
  IndexName?: string;
  KeyConditionExpression: string;
  FilterExpression?: string;
  ExpressionAttributeNames?: Record<string, string>;
  ExpressionAttributeValues?: Record<string, unknown>;
  Limit?: number;
}

export interface QueryOutput<T = Record<string, unknown>> {
  Items: T[];
  Count: number;
}

export interface ScanInput {
  TableName: string;
  FilterExpression?: string;
  ExpressionAttributeNames?: Record<string, string>;
  ExpressionAttributeValues?: Record<string, unknown>;
  Limit?: number;
}

export interface ScanOutput<T = Record<string, unknown>> {
  Items: T[];
  Count: number;
}

/**
 * Common interface matching AWS DynamoDB Document Client API.
 * In preview, implemented by MemoryDynamoDB.
 * In production AWS, implemented by AWS SDK v3 DynamoDBDocumentClient.
 */
export interface DynamoDBDataAccessLayer {
  getItem<T = Record<string, unknown>>(params: GetItemInput): Promise<GetItemOutput<T>>;
  putItem(params: PutItemInput): Promise<void>;
  deleteItem(params: DeleteItemInput): Promise<void>;
  updateItem(params: UpdateItemInput): Promise<void>;
  query<T = Record<string, unknown>>(params: QueryInput): Promise<QueryOutput<T>>;
  scan<T = Record<string, unknown>>(params: ScanInput): Promise<ScanOutput<T>>;
}
