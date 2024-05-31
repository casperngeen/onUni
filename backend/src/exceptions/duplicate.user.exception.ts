import { BaseException } from './base.exception';

export class DuplicateUserException extends BaseException {
  constructor() {
    super('User already exists', 405, 201);
  }
}
