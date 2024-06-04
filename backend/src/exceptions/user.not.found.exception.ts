import { BaseException } from './base.exception';

export class UserNotFoundException extends BaseException {
  constructor() {
    super('User not found', 404, 206);
  }
}
