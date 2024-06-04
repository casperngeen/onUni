import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from './exceptions/base.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const httpCode = exception.getStatus();

    if (exception instanceof BaseException) {
      const statusCode = exception.getErrorCode();
      response.status(httpCode).json({
        httpCode: httpCode,
        statusCode: statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      response.status(httpCode).json({
        httpCode: httpCode,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
