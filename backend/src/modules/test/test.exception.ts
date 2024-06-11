import { BaseException } from 'src/base/base.exception';
import { TestException } from 'src/base/status.code';

export class TestNotFoundException extends BaseException {
  constructor() {
    super(`Course not found`, 404, TestException.TEST_NOT_FOUND);
  }
}
