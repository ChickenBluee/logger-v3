// src/logger-v3/utils/interpolate-pattern.utils.ts

import type { BaseLogInfo, LevelLogger } from '../logger.types.js';

const ADVANCED_PIPE_REGEX = /@([\w.]+)(?:\|([\w|]+))?/g;

export const ENGINE_DEFAULTS = {
  MISSING_KEY: 'UNSET',
  EMPTY_DATA: 'N/A'
} as const;

export const LOG_MODIFIERS = {
  SILENT: 'silent',
  LABEL: 'label',
  BRACKET: 'bracket',
  PAREN: 'paren',
  UPPER: 'upper',
  LOWER: 'lower'
} as const;

export type LogModifier = (typeof LOG_MODIFIERS)[keyof typeof LOG_MODIFIERS];

type PatternLogInfo = BaseLogInfo & {
  level?: LevelLogger;
};

type StringKeyOf<T> = Extract<keyof T, string>;

type NestedKeyOf<T> = T extends object ? { [Key in StringKeyOf<T>]: NonNullable<T[Key]> extends object ? `${Key}` | `${Key}.${NestedKeyOf<NonNullable<T[Key]>>}` : `${Key}` }[StringKeyOf<T>] : never;

export type LogKey = NestedKeyOf<PatternLogInfo>;

type ValueFormatter = (val: string, key: string, isMissing: boolean) => string;

export class PatternInterpolationEngine {
  private static stringify(value: unknown): string {
    if (value === null || value === undefined || value === '') return '';

    if (typeof value === 'string') return value.trim();

    if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);

    if (value instanceof Error) return value.stack ?? value.message;

    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return '';
      }
    }

    return '';
  }

  private static getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((acc: unknown, part: string) => {
      if (acc && typeof acc === 'object' && part in acc) return (acc as Record<string, unknown>)[part];

      return undefined;
    }, obj);
  }

  private static readonly formatters: Record<LogModifier, ValueFormatter> = {
    [LOG_MODIFIERS.SILENT]: (val, _key, isMissing) => (isMissing || !val ? '' : val),

    [LOG_MODIFIERS.LABEL]: (val, key) => (val ? `${key.toUpperCase()}: ${val}` : ''),

    [LOG_MODIFIERS.BRACKET]: val => (val ? `[${val}]` : ''),

    [LOG_MODIFIERS.PAREN]: val => (val ? `(${val})` : ''),

    [LOG_MODIFIERS.UPPER]: val => val.toUpperCase(),

    [LOG_MODIFIERS.LOWER]: val => val.toLowerCase()
  };

  public static render(pattern: string, info: PatternLogInfo): string {
    const rendered = pattern.replace(ADVANCED_PIPE_REGEX, (_, path: string, pipeString?: string) => {
      const rawValue = this.getNestedValue(info as unknown as Record<string, unknown>, path);

      const isKeyPresent = rawValue !== undefined;
      const strValue = this.stringify(rawValue);

      const modifiers: LogModifier[] = pipeString ? (pipeString.split('|') as LogModifier[]) : [];

      if (modifiers.includes(LOG_MODIFIERS.SILENT) && (!isKeyPresent || !strValue)) return '';

      let currentVal = strValue || (!isKeyPresent ? ENGINE_DEFAULTS.MISSING_KEY : ENGINE_DEFAULTS.EMPTY_DATA);

      for (const mod of modifiers) {
        if (mod === LOG_MODIFIERS.SILENT) continue;

        const formatFn = this.formatters[mod];
        const labelKey = path.split('.').pop() ?? path;

        currentVal = formatFn(currentVal, labelKey, !isKeyPresent);
      }

      return currentVal;
    });

    return rendered.replace(/\s+/g, ' ').trim();
  }
}

export const interpolatePattern = (pattern: string, info: PatternLogInfo): string => {
  return PatternInterpolationEngine.render(pattern, info);
};

export const token = <Key extends LogKey>(key: Key, ...modifiers: LogModifier[]): string => {
  const filteredModifiers = key === 'level' ? modifiers.filter(modifier => modifier !== LOG_MODIFIERS.UPPER) : modifiers;

  return filteredModifiers.length > 0 ? `@${key}|${filteredModifiers.join('|')}` : `@${key}`;
};
