import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
  private readonly logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(
        ({ timestamp, level, message, context, ...meta }) => {
          return `${timestamp} [${level}] ${message} ${context ? `[${context}]` : ''} ${meta ? JSON.stringify(meta) : ''}`;
        },
      ),
    ),
  });

  log(message: string, context?: string, meta: Record<string, any> = {}) {
    this.logger.info(message, { context, ...meta });
  }

  error(message: string, context?: string, meta: Record<string, any> = {}) {
    this.logger.error(message, { context, ...meta });
  }

  warn(message: string, context?: string, meta: Record<string, any> = {}) {
    this.logger.warn(message, { context, ...meta });
  }

  debug(message: string, context?: string, meta: Record<string, any> = {}) {
    this.logger.debug(message, { context, ...meta });
  }
}
