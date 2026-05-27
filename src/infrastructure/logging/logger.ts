/**
 * Centralized Logging System
 * Using Pino for structured logging
 */

import pino from 'pino';
import { env } from '@config/env';

// Create logger instance
const logger = pino(
  {
    level: env.LOG_LEVEL,
    transport:
      env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    serializers: {
      req: (req: any) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        headers: req.headers,
      }),
      res: (res: any) => ({
        statusCode: res.statusCode,
        headers: res.headers,
      }),
      err: pino.stdSerializers.err,
    },
  }
);

export class Logger {
  static debug(message: string, data?: Record<string, any>) {
    logger.debug(data, message);
  }

  static info(message: string, data?: Record<string, any>) {
    logger.info(data, message);
  }

  static warn(message: string, data?: Record<string, any>) {
    logger.warn(data, message);
  }

  static error(message: string, error?: Error | Record<string, any>) {
    if (error instanceof Error) {
      logger.error({ err: error }, message);
    } else {
      logger.error(error, message);
    }
  }

  static fatal(message: string, error?: Error | Record<string, any>) {
    if (error instanceof Error) {
      logger.fatal({ err: error }, message);
    } else {
      logger.fatal(error, message);
    }
  }

  static trace(message: string, data?: Record<string, any>) {
    logger.trace(data, message);
  }

  static child(bindings: Record<string, any>) {
    return logger.child(bindings);
  }
}

export default logger;
