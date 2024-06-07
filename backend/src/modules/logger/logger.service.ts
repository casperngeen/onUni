import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger, createLogger } from 'winston';
import { winstonConfig } from './winston.config';
import * as path from 'path';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: Logger;
  constructor() {
    this.logger = createLogger(winstonConfig);
  }

  private getContext(): string {
    const trace = StackTrace.getSync();
    if (!trace[0]) {
      return '';
    }
    return path.basename(trace[0].fileName);
  }

  log(message: string) {
    this.logger.info(message, { context: this.getContext() });
  }

  error(message: string, trace: string) {
    this.logger.error(message, { context: this.getContext(), trace });
  }

  // to warn other developers
  warn(message: string) {
    this.logger.warn(message, { context: this.getContext() });
  }

  // for debugging in development env
  debug(message: string) {
    this.logger.debug(message, { context: this.getContext() });
  }
}
