import { BaseException } from 'src/base/base.exception';
import {
  AttemptException,
  QuestionAttemptException,
} from 'src/base/status.code';

export class AttemptNotFoundException extends BaseException {
  constructor() {
    super(`Attempt not found`, 404, AttemptException.ATTEMPT_NOT_FOUND);
  }
}

export class TestNotAttemptedException extends BaseException {
  constructor() {
    super(
      `Test has not been attempted by user`,
      200,
      AttemptException.TEST_NOT_ATTEMPTED,
    );
  }
}

export class ReachedAttemptLimitException extends BaseException {
  constructor() {
    super(
      `User has reached attempt limit for test`,
      200,
      AttemptException.LIMIT_REACHED,
    );
  }
}

export class QuestionAttemptNotFoundException extends BaseException {
  constructor() {
    super(
      `Question attempt not found`,
      404,
      QuestionAttemptException.QUESTION_ATTEMPT_NOT_FOUND,
    );
  }
}

export class OptionNotInQuestionException extends BaseException {
  constructor() {
    super(
      `Selected option does not belong to question`,
      200,
      QuestionAttemptException.OPTION_NOT_IN_QUESTION,
    );
  }
}
