import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LoggerService } from './modules/logger/logger.service';
import { InvalidInputException } from './base/base.exception';
import { HttpExceptionFilter } from './http.exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);
  logger.log('Application is starting...');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: () => {
        logger.error('Validation pipe caught invalid input', '');
        throw new InvalidInputException();
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
  logger.log('Application is running on port 3000');
}
bootstrap();
