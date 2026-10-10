// src/logger-v3/utils/normalize-ip.utils.ts

import { isIP } from 'node:net';
import { networkInterfaces } from 'node:os';
import type { IPLogInfo } from '../logger.types.js';

let cachedServerIpSet: Set<string> | null = null;

function resolveServerIPs(): Set<string> {
  if (cachedServerIpSet) return cachedServerIpSet;

  const rawConfig = process.env.SERVER_IPS;
  if (rawConfig) {
    const ipList = typeof rawConfig === 'string' ? rawConfig.split(',').map(ip => ip.trim()) : rawConfig;

    cachedServerIpSet = new Set(ipList.filter(Boolean));
    return cachedServerIpSet;
  }

  const ipSet = new Set<string>();
  const networkInterfacesMap = networkInterfaces();

  for (const interfaceList of Object.values(networkInterfacesMap)) {
    if (!interfaceList) continue;

    for (const netInfo of interfaceList) {
      let currentIp = netInfo.address;
      if (currentIp.startsWith('::ffff:')) currentIp = currentIp.substring(7);
      ipSet.add(currentIp);
    }
  }

  cachedServerIpSet = ipSet;
  return cachedServerIpSet;
}

export function normalizeIpForLog(ipInput?: IPLogInfo | string): IPLogInfo {
  const rawAddress = typeof ipInput === 'string' ? ipInput : ipInput?.address;

  if (!rawAddress || typeof rawAddress !== 'string' || !rawAddress.trim()) return { address: 'UNKNOWN', label: 'UNKNOWN' };

  let normalizedIp = rawAddress.trim();

  if (normalizedIp.startsWith('::ffff:')) normalizedIp = normalizedIp.substring(7);
  if (normalizedIp === '::1' || normalizedIp === '0:0:0:0:0:0:0:1') normalizedIp = '127.0.0.1';

  if (isIP(normalizedIp) === 0) return { address: 'INVALID_IP', label: 'INVALID_IP' };

  if (normalizedIp.startsWith('127.')) return { address: normalizedIp, label: 'LOCALHOST' };

  if (resolveServerIPs().has(normalizedIp)) return { address: normalizedIp, label: 'SERVER' };

  return { address: normalizedIp };
}
