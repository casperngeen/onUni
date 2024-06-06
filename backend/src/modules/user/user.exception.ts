import { BaseException } from 'src/base/base.exception';
import { UserException } from 'src/base/status.code';

export class DuplicateUserException extends BaseException {
  constructor() {
    super('User already exists', 200, UserException.DUPLICATE_USER);
  }
}

export class UnauthorisedUserException extends BaseException {
  constructor() {
    super('Unauthorised', 401, UserException.UNAUTHORISED_USER);
  }
}

export class UserNotFoundException extends BaseException {
  constructor() {
    super(`User not found`, 404, UserException.USER_NOT_FOUND);
  }
}
