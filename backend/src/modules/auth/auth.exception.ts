import { AuthException } from 'src/base/status.code';
import { BaseException } from '../../base/base.exception';

export class ExpiredTokenException extends BaseException {
  constructor() {
    super('Token has expired', 200, AuthException.EXPIRED_TOKEN);
  }
}

export class MailNotSentException extends BaseException {
  constructor() {
    super('Mail could not be sent', 400, AuthException.MAIL_NOT_SENT);
  }
}

export class PasswordIncorrectException extends BaseException {
  constructor() {
    super('Passwords do not match', 401, AuthException.PASSWORD_INCORRECT);
  }
}

export class HashFailedExcepion extends BaseException {
  constructor() {
    super('Hash failed', 500, AuthException.HASH_FAILED);
  }
}

export class TokenGenerationFailedException extends BaseException {
  constructor() {
    super(
      'Token generation failed',
      500,
      AuthException.TOKEN_GENERATION_FAILED,
    );
  }
}
