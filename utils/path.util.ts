// src/logger-v3/utils/path.util.ts

import path from 'node:path';

/**
 * Tự chuyển đổi đường dẫn tương đối thành tuyệt đối dựa trên Root Directory của dự án
 */
export function resolveLogPath(relativePath: string): string {
  if (path.isAbsolute(relativePath)) {
    return relativePath;
  }
  return path.resolve(process.cwd(), relativePath);
}
