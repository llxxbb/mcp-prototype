const logLevels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLogLevel = logLevels.debug; // Default to debug level

export const logger = {
  debug: (message: string, data?: unknown) => {
    if (currentLogLevel <= logLevels.debug) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
  info: (message: string, data?: unknown) => {
    if (currentLogLevel <= logLevels.info) {
      console.info(`[INFO] ${message}`, data);
    }
  },
  warn: (message: string, data?: unknown) => {
    if (currentLogLevel <= logLevels.warn) {
      console.warn(`[WARN] ${message}`, data);
    }
  },
  error: (message: string, data?: unknown) => {
    if (currentLogLevel <= logLevels.error) {
      console.error(`[ERROR] ${message}`, data);
    }
  },
};
