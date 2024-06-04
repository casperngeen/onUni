import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonConfig = {
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, context }) => {
      return `${timestamp} [${level}] [${context}]: ${message}`;
    }),
  ),
  transports: [
    // default: log to general file
    new winston.transports.DailyRotateFile({
      dirname: '../../logs',
      filename: '%DATE%.app.log',
      datePattern: 'DD-MM-YYYY',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    // save errors to a separate file
    new winston.transports.DailyRotateFile({
      dirname: '../../logs',
      filename: '%DATE%.error.log',
      datePattern: 'DD-MM-YYYY',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    }),
    // debug: log to console
    new winston.transports.Console({ level: 'debug' }),
  ],
};
