// src/logger-v3/format/base.format.ts

import { format, type Logform } from 'winston';
import { DEFAULT_LOG_PATTERN } from '../constants/pattern.constant.js';
import { interpolatePattern } from '../utils/interpolate-pattern.utils.js';
import { normalizeIpForLog } from '../utils/normalize-ip.utils.js';
import type { BaseLogInfo } from '../logger.types.js';

const normalizeBaseLogInfo = (info: BaseLogInfo): void => {
  info.timestamp = info.timestamp ?? new Date().toISOString();

  info.ip = normalizeIpForLog(info.ip);

  info.icon = info.icon ?? 'i';
};

export const createBaseFormatter = (defaultPattern: string = DEFAULT_LOG_PATTERN): Logform.Format => {
  return format.printf((info: Logform.TransformableInfo): string => {
    const logInfo = info as BaseLogInfo;
    normalizeBaseLogInfo(logInfo);

    const patternToUse = logInfo.customPattern ?? defaultPattern;

    return interpolatePattern(patternToUse, logInfo);
  });
};
