import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from './base/base.exception';
import { ResponseHandler } from './base/base.response';
import { GeneralException } from './base/status.code';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpCode = exception.getStatus();

    if (exception instanceof BaseException) {
      const statusCode = exception.getErrorCode();
      response
        .status(httpCode)
        .json(ResponseHandler.fail(statusCode, exception.message));
    } else {
      response
        .status(httpCode)
        .json(
          ResponseHandler.fail(GeneralException.UNSPECIFIED, exception.message),
        );
    }
  }
}
