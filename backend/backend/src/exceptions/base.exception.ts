import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
  private readonly errorCode: number;
  constructor(message: string, httpCode: number, errorCode: number) {
    super(message, httpCode);
    this.errorCode = errorCode;
  }

  getErrorCode() {
    return this.errorCode;
  }
}
