import { BaseException } from './base.exception';

export class MailNotSentException extends BaseException {
  constructor() {
    super('Mail could not be sent', 400, 203);
  }
}
