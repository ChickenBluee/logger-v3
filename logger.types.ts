// src/logger-v3/logger.types.ts

import type { config } from 'winston';

export type IconLogger = '✓' | 'x' | '⚠' | '»' | '→' | '•' | '⚑' | 'i';

export type LevelLogger = keyof typeof config.npm.levels;

export type IPLogLabel = 'LOCALHOST' | 'SERVER' | 'INVALID_IP' | 'UNKNOWN';

export interface IPLogInfo {
  address?: string;
  label?: IPLogLabel;
}

export interface BaseLogInfo {
  message: string;
  stack?: string;

  timestamp?: string;
  icon?: IconLogger;
  ip?: IPLogInfo;
  tag?: string;
  action?: string;
  requestId?: string;

  statusCode?: number;
  duration?: number;
  method?: string;
  path?: string;
  result?: boolean;
  customPattern?: string;
}
