import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LoggerService } from './modules/logger/logger.service';
import { InvalidInputException } from './base/base.exception';
import { HttpExceptionFilter } from './http.exception.filter';
import { AppModule } from './app.module';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: [process.env.FRONTEND_PORTAL] },
  });
  const logger = app.get(LoggerService);
  logger.log(
    'Application is starting...',
    StackTrace.getSync().map((frame) => path.basename(frame.fileName))[0],
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: () => {
        logger.error(
          'Validation pipe caught invalid input',
          StackTrace.getSync().map((frame) => path.basename(frame.fileName))[0],
          StackTrace.getSync()
            .map((frame) => frame.toString())
            .join('\n'),
        );
        throw new InvalidInputException();
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
  logger.log(
    'Application is running on port 3000',
    StackTrace.getSync().map((frame) => path.basename(frame.fileName))[0],
  );
}
bootstrap();
