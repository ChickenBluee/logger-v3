// src/logger-v3/transports/rejection.transport.ts

import DailyRotateFile from 'winston-daily-rotate-file';
import { loggerConfig } from '#config-logger';
import { resolveLogPath } from '../utils/path.util.js';

export function createRejectionTransport(): DailyRotateFile {
  return new DailyRotateFile({
    datePattern: loggerConfig.datePattern,
    maxSize: loggerConfig.maxSize,
    maxFiles: loggerConfig.maxFiles,
    extension: '.log',
    dirname: resolveLogPath(loggerConfig.paths.rejection),
    filename: loggerConfig.fileNames.rejection
  });
}
