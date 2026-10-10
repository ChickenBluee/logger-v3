// src/logger-v3/transports/console.transport.ts

import { transports, format } from 'winston';
import { createBaseFormatter } from '../format/base.format.js';

export function createConsoleTransport(): transports.ConsoleTransportInstance {
  return new transports.Console({
    format: format.combine(format.colorize({ all: true }), createBaseFormatter())
  });
}
