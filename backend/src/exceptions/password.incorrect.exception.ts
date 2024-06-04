import { BaseException } from './base.exception';

export class PasswordIncorrectException extends BaseException {
  constructor() {
    super('Passwords do not match', 403, 204);
  }
}
