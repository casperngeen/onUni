import { HttpException } from '@nestjs/common';
import { GeneralException } from './status.code';

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

export class InvalidInputException extends BaseException {
  constructor() {
    super('Input is invalid', 400, GeneralException.INVALID_INPUT);
  }
}
