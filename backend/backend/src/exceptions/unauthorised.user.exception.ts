import { BaseException } from './base.exception';

export class UnauthorisedUserException extends BaseException {
  constructor() {
    super('Unauthorised', 401, 205);
  }
}
