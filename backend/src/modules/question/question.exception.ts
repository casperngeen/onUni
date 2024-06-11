import { BaseException } from 'src/base/base.exception';
import { OptionException, QuestionException } from 'src/base/status.code';

export class QuestionNotFoundException extends BaseException {
  constructor() {
    super('Question not found', 404, QuestionException.QUESTION_NOT_FOUND);
  }
}

export class OptionNotFoundException extends BaseException {
  constructor() {
    super('Option not found', 404, OptionException.OPTION_NOT_FOUND);
  }
}
