import { BaseException } from './base.exception';

export class ExpiredTokenException extends BaseException {
  constructor() {
    super('Verification link has expired', 400, 202);
  }
}
