// src/logger-v3/constants/pattern.constant.ts

import { token } from '../utils/interpolate-pattern.utils.js';

export const DEFAULT_LOG_PATTERN = `${token('timestamp', 'bracket')} ${token('level', 'bracket')} ${token('icon', 'bracket')} ${token('ip.label', 'bracket')} [${token('tag')} | ${token('action')}]: ${token('message', 'silent')}`;
