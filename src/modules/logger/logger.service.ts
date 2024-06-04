import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger, createLogger } from 'winston';
import { winstonConfig } from './winston.config';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: Logger;
  constructor() {
    this.logger = createLogger(winstonConfig);
  }

  log(message: string, context: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace: string, context: string) {
    this.logger.error(message, { context, trace });
  }

  // to warn other developers
  warn(message: string, context: string) {
    this.logger.warn(message, { context });
  }

  // for debugging in development env
  debug(message: string, context: string) {
    this.logger.debug(message, { context });
  }
}
