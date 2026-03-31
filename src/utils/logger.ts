// src/utils/logger.ts
const isDev = process.env.NODE_ENV === "development";

export const logger = {
  error: (msg: string, ...args: unknown[]) => {
    if (isDev) console.error(`[ERROR] ${msg}`, ...args);
    else console.error(`[ERROR] ${msg}`); // No args in prod
  },
  warn: (msg: string) => {
    if (isDev) console.warn(`[WARN] ${msg}`);
  },
  debug: (...args: unknown[]) => {
    if (isDev) console.log("[DEBUG]", ...args);
  },
};
