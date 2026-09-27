/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DynamoDBDataAccessLayer,
  GetItemInput,
  GetItemOutput,
  PutItemInput,
  DeleteItemInput,
  UpdateItemInput,
  QueryInput,
  QueryOutput,
  ScanInput,
  ScanOutput,
} from './dynamodb-interface';
import { createLogger } from '../lib/logger';

const logger = createLogger('MemoryDynamoDB');

export class MemoryDynamoDB implements DynamoDBDataAccessLayer {
  private tables: Map<string, Map<string, Record<string, unknown>>> = new Map();

  private getTable(tableName: string): Map<string, Record<string, unknown>> {
    if (!this.tables.has(tableName)) {
      this.tables.set(tableName, new Map());
    }
    return this.tables.get(tableName)!;
  }

  private makeKey(pk: unknown, sk: unknown): string {
    return `${String(pk)}##${String(sk)}`;
  }

  async getItem<T = Record<string, unknown>>(params: GetItemInput): Promise<GetItemOutput<T>> {
    const table = this.getTable(params.TableName);
    const key = this.makeKey(params.Key.PK, params.Key.SK);
    const item = table.get(key);
    return { Item: item ? (structuredClone(item) as T) : undefined };
  }

  async putItem(params: PutItemInput): Promise<void> {
    const table = this.getTable(params.TableName);
    const item = params.Item;
    const pk = item.PK;
    const sk = item.SK;
    if (pk === undefined || sk === undefined) {
      throw new Error('Item must contain both PK and SK');
    }
    const key = this.makeKey(pk, sk);

    // Conditional check evaluation
    if (params.ConditionExpression) {
      const cond = params.ConditionExpression.trim();
      if (cond.includes('attribute_not_exists')) {
        if (table.has(key)) {
          const err = new Error('The conditional request failed: item already exists');
          (err as unknown as { code: string }).code = 'ConditionalCheckFailedException';
          throw err;
        }
      }
    }

    table.set(key, structuredClone(item));
    logger.debug('PutItem stored', { TableName: params.TableName, PK: pk, SK: sk });
  }

  async deleteItem(params: DeleteItemInput): Promise<void> {
    const table = this.getTable(params.TableName);
    const key = this.makeKey(params.Key.PK, params.Key.SK);
    table.delete(key);
  }

  async updateItem(params: UpdateItemInput): Promise<void> {
    const table = this.getTable(params.TableName);
    const key = this.makeKey(params.Key.PK, params.Key.SK);
    const existing = table.get(key);

    if (params.ConditionExpression && params.ConditionExpression.includes('attribute_exists')) {
      if (!existing) {
        const err = new Error('The conditional request failed: item does not exist');
        (err as unknown as { code: string }).code = 'ConditionalCheckFailedException';
        throw err;
      }
    }

    const item = existing ? structuredClone(existing) : { PK: params.Key.PK, SK: params.Key.SK };

    // Simple parser for standard DynamoDB SET expressions: "SET #status = :status, #updatedAt = :updatedAt"
    const updateExpr = params.UpdateExpression.replace(/^SET\s+/i, '');
    const assignments = updateExpr.split(',').map(s => s.trim());

    for (const assignment of assignments) {
      const [rawLeft, rawRight] = assignment.split('=').map(s => s.trim());
      if (!rawLeft || !rawRight) continue;

      const attrName = params.ExpressionAttributeNames?.[rawLeft] || rawLeft.replace(/^#/, '');
      const attrValue = params.ExpressionAttributeValues?.[rawRight] !== undefined
        ? params.ExpressionAttributeValues[rawRight]
        : rawRight;

      item[attrName] = attrValue;
    }

    table.set(key, item);
  }

  async query<T = Record<string, unknown>>(params: QueryInput): Promise<QueryOutput<T>> {
    const table = this.getTable(params.TableName);
    const values = params.ExpressionAttributeValues || {};
    const results: T[] = [];

    const isGSI1 = params.IndexName === 'GSI1';

    for (const rawItem of table.values()) {
      const item = structuredClone(rawItem);

      if (isGSI1) {
        const targetGSI1PK = values[':gsi1pk'];
        const prefixGSI1SK = values[':gsi1skPrefix'];
        const exactGSI1SK = values[':gsi1sk'];

        if (targetGSI1PK !== undefined && item.GSI1PK !== targetGSI1PK) {
          continue;
        }
        if (prefixGSI1SK !== undefined && !String(item.GSI1SK || '').startsWith(String(prefixGSI1SK))) {
          continue;
        }
        if (exactGSI1SK !== undefined && item.GSI1SK !== exactGSI1SK) {
          continue;
        }
      } else {
        const targetPK = values[':pk'];
        const targetSK = values[':sk'];
        const prefixSK = values[':skPrefix'];

        if (targetPK !== undefined && item.PK !== targetPK) {
          continue;
        }
        if (prefixSK !== undefined && !String(item.SK || '').startsWith(String(prefixSK))) {
          continue;
        }
        if (targetSK !== undefined && item.SK !== targetSK) {
          continue;
        }
      }

      // Check simple filter expressions if present
      if (params.FilterExpression) {
        let match = true;
        for (const [vKey, vVal] of Object.entries(values)) {
          if (vKey === ':pk' || vKey === ':sk' || vKey === ':skPrefix' || vKey === ':gsi1pk' || vKey === ':gsi1skPrefix') {
            continue;
          }
          // If filter checks an attribute
          for (const [attrPlaceholder, attrName] of Object.entries(params.ExpressionAttributeNames || {})) {
            if (params.FilterExpression.includes(attrPlaceholder) && params.FilterExpression.includes(vKey)) {
              if (item[attrName] !== vVal) {
                match = false;
                break;
              }
            }
          }
        }
        if (!match) continue;
      }

      results.push(item as T);
      if (params.Limit && results.length >= params.Limit) {
        break;
      }
    }

    return { Items: results, Count: results.length };
  }

  async scan<T = Record<string, unknown>>(params: ScanInput): Promise<ScanOutput<T>> {
    const table = this.getTable(params.TableName);
    const results: T[] = [];
    const values = params.ExpressionAttributeValues || {};

    for (const rawItem of table.values()) {
      const item = structuredClone(rawItem);
      let match = true;

      if (params.FilterExpression) {
        for (const [attrPlaceholder, attrName] of Object.entries(params.ExpressionAttributeNames || {})) {
          for (const [valPlaceholder, val] of Object.entries(values)) {
            if (params.FilterExpression.includes(`${attrPlaceholder} = ${valPlaceholder}`)) {
              if (item[attrName] !== val) {
                match = false;
                break;
              }
            }
          }
        }
      }

      if (match) {
        results.push(item as T);
        if (params.Limit && results.length >= params.Limit) {
          break;
        }
      }
    }

    return { Items: results, Count: results.length };
  }

  // Method to clear table for testing
  clear() {
    this.tables.clear();
  }
}

// Global singleton instance for runtime
export const memoryDynamoDB = new MemoryDynamoDB();
