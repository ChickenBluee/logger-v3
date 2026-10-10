// src/logger-v3/transports/combined.transport.ts

import DailyRotateFile from 'winston-daily-rotate-file';
import { loggerConfig } from '#config-logger';
import { resolveLogPath } from '../utils/path.util.js';

export function createCombinedFileTransport(): DailyRotateFile {
  return new DailyRotateFile({
    datePattern: loggerConfig.datePattern,
    maxSize: loggerConfig.maxSize,
    maxFiles: loggerConfig.maxFiles,
    extension: '.log',
    dirname: resolveLogPath(loggerConfig.paths.combined),
    filename: loggerConfig.fileNames.combined
  });
}
