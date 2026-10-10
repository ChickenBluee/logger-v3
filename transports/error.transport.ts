// src/logger-v3/transports/error.transport.ts

import DailyRotateFile from 'winston-daily-rotate-file';
import { loggerConfig } from '#config-logger';
import { resolveLogPath } from '../utils/path.util.js';

export function createErrorFileTransport(): DailyRotateFile {
  return new DailyRotateFile({
    level: 'error',
    datePattern: loggerConfig.datePattern,
    maxSize: loggerConfig.maxSize,
    maxFiles: loggerConfig.maxFiles,
    extension: '.log',
    dirname: resolveLogPath(loggerConfig.paths.error),
    filename: loggerConfig.fileNames.error
  });
}
