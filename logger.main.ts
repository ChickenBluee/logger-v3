// src/logger-v3/logger.main.ts

import { createLogger, format, type Logger } from 'winston';
import { loggerConfig } from '#config-logger';

import { createBaseFormatter } from './format/base.format.js';
import { createCombinedFileTransport } from './transports/combined.transport.js';
import { createConsoleTransport } from './transports/console.transport.js';
import { createErrorFileTransport } from './transports/error.transport.js';
import { createExceptionTransport } from './transports/exception.transport.js';
import { createRejectionTransport } from './transports/rejection.transport.js';

const { combine, timestamp, errors } = format;

export const rootLogger: Logger = createLogger({
  level: loggerConfig.level,
  format: combine(timestamp({ format: loggerConfig.timeFormat }), errors({ stack: true }), createBaseFormatter()),
  transports: [createCombinedFileTransport(), createErrorFileTransport(), createConsoleTransport()],
  exceptionHandlers: [createExceptionTransport()],
  rejectionHandlers: [createRejectionTransport()],
  exitOnError: false
});
