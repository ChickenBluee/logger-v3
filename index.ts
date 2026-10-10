// src/logger-v3/index.ts

import { inspect } from 'node:util';
import { rootLogger } from './logger.main.js';
import type { BaseLogInfo } from './logger.types.js';

export interface LogOptionsInfo {
  message: BaseLogInfo['message'];
  meta?: Omit<BaseLogInfo, 'message'>;
}

export interface LogOptionsWarn {
  message: BaseLogInfo['message'];
  meta?: Omit<BaseLogInfo, 'message'>;
}

export interface LogOptionsError {
  message?: string;
  error?: unknown;
  meta?: Omit<BaseLogInfo, 'message'>;
}

function deepMerge(target: Partial<BaseLogInfo>, source?: Partial<BaseLogInfo>): Partial<BaseLogInfo> {
  const isObject = (item: unknown): item is Record<string, unknown> => item !== null && typeof item === 'object' && !Array.isArray(item);

  if (!source) return { ...target };

  const output: Partial<BaseLogInfo> = { ...target };

  const targetRecord = target as Record<string, unknown>;
  const sourceRecord = source as Record<string, unknown>;
  const outputRecord = output as Record<string, unknown>;

  for (const key of Object.keys(sourceRecord)) {
    const sourceValue = sourceRecord[key];
    const targetValue = targetRecord[key];

    if (isObject(sourceValue) && isObject(targetValue)) {
      outputRecord[key] = deepMerge(targetValue, sourceValue);
    } else {
      outputRecord[key] = sourceValue;
    }
  }

  return output;
}

export class LoggerWrapper {
  constructor(private readonly defaultMeta: Partial<BaseLogInfo> = {}) {}

  private formatMeta(meta?: Partial<BaseLogInfo>): Partial<BaseLogInfo> {
    return deepMerge(this.defaultMeta, meta);
  }

  info(options: LogOptionsInfo): void {
    const { message, meta } = options;

    rootLogger.info(message, this.formatMeta(meta));
  }

  warn(options: LogOptionsWarn): void {
    const { message, meta } = options;

    rootLogger.warn(message, this.formatMeta(meta));
  }

  error(options: LogOptionsError): void {
    const { message, error, meta } = options;

    const resolvedError = error instanceof Error ? error : error === undefined ? undefined : new Error(inspect(error));

    const finalMessage = message ?? resolvedError?.message ?? 'UNKNOWN ERROR';

    rootLogger.error(finalMessage, { ...this.formatMeta(meta), ...(resolvedError ? { stack: resolvedError.stack } : {}) });
  }

  close(): void {
    rootLogger.close();
  }

  child(meta: Partial<BaseLogInfo>): LoggerWrapper {
    return new LoggerWrapper(deepMerge(this.defaultMeta, meta));
  }
}
export const logger = new LoggerWrapper();
