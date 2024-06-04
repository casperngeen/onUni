import { BaseException } from './base.exception';

export class InvalidInputException extends BaseException {
  constructor() {
    super('Input is invalid', 400, 101);
  }
}
