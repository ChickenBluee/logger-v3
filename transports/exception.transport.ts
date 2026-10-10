// src/logger-v3/transports/exception.transport.ts

import DailyRotateFile from 'winston-daily-rotate-file';
import { loggerConfig } from '#config-logger';
import { resolveLogPath } from '../utils/path.util.js';

export function createExceptionTransport(): DailyRotateFile {
  return new DailyRotateFile({
    datePattern: loggerConfig.datePattern,
    maxSize: loggerConfig.maxSize,
    maxFiles: loggerConfig.maxFiles,
    extension: '.log',
    dirname: resolveLogPath(loggerConfig.paths.exception),
    filename: loggerConfig.fileNames.exception
  });
}
