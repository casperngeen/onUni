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
    this.logger.info(message, { context: context });
  }

  error(message: string, context: string, trace: string) {
    this.logger.error(message, { context: context, trace });
  }

  // to warn other developers
  warn(message: string, context: string) {
    this.logger.warn(message, { context: context });
  }

  // for debugging in development env
  debug(message: string, context: string) {
    this.logger.debug(message, { context: context });
  }
}
