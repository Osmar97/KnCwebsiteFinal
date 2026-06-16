import { logger } from "@/lib/logger";
/**
 * Minimal logger that no-ops in production builds.
 * Use instead of `console.*` to avoid noisy production output and PII leaks.
 */
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) logger.log(...args);
  },
  info: (...args: unknown[]) => {
    if (isDev) logger.info(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) logger.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (isDev) logger.error(...args);
  },
  debug: (...args: unknown[]) => {
    if (isDev) logger.debug(...args);
  },
};