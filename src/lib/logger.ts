/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'salt',
  'token',
  'secret',
  'sessionsecret',
  'authorization',
]);

const runtimeEnv =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : typeof process !== 'undefined' && process.env
      ? process.env
      : {} as Record<string, string | undefined>;

function sanitizeData(obj: unknown, depth = 0): unknown {
  if (depth > 5) return '[Truncated]';
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeData(item, depth + 1));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value, depth + 1);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// In-memory ring buffer for recent logs to display in diagnostics view
const LOG_BUFFER_SIZE = 100;
const memoryLogs: LogEntry[] = [];

export class Logger {
  private module: string;

  constructor(module: string) {
    this.module = module;
  }

  private write(level: LogLevel, message: string, data?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module: this.module,
      message,
      data: data ? (sanitizeData(data) as Record<string, unknown>) : undefined,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: runtimeEnv.NODE_ENV === 'production' ? undefined : error.stack,
          }
        : undefined,
    };

    memoryLogs.push(entry);
    if (memoryLogs.length > LOG_BUFFER_SIZE) {
      memoryLogs.shift();
    }

    const consoleMethod = level === 'ERROR' ? console.error : level === 'WARN' ? console.warn : console.log;
    const dataStr = entry.data ? ` | ${JSON.stringify(entry.data)}` : '';
    const errStr = entry.error ? ` | Error: ${entry.error.message}` : '';
    consoleMethod(`[${entry.timestamp}] [${entry.level}] [${entry.module}] ${entry.message}${dataStr}${errStr}`);
  }

  debug(message: string, data?: Record<string, unknown>) {
    this.write('DEBUG', message, data);
  }

  info(message: string, data?: Record<string, unknown>) {
    this.write('INFO', message, data);
  }

  warn(message: string, data?: Record<string, unknown>) {
    this.write('WARN', message, data);
  }

  error(message: string, error?: unknown, data?: Record<string, unknown>) {
    const err = error instanceof Error ? error : error ? new Error(String(error)) : undefined;
    this.write('ERROR', message, data, err);
  }

  static getRecentLogs(): LogEntry[] {
    return [...memoryLogs];
  }
}

export function createLogger(module: string): Logger {
  return new Logger(module);
}
