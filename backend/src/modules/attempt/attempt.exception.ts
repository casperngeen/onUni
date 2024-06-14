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
      400,
      AttemptException.TEST_NOT_ATTEMPTED,
    );
  }
}

export class ReachedAttemptLimitException extends BaseException {
  constructor() {
    super(
      `User has reached attempt limit for test`,
      400,
      AttemptException.ATTEMPT_LIMIT_REACHED,
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
      400,
      QuestionAttemptException.OPTION_NOT_IN_QUESTION,
    );
  }
}

export class AttemptAlreadySubmittedException extends BaseException {
  constructor() {
    super(
      `Attempt has already been submitted`,
      400,
      AttemptException.ALREADY_SUBMITTED,
    );
  }
}

export class CalculatingScoreOfAttemptException extends BaseException {
  constructor() {
    super(
      `Score of attempt is being calculated`,
      400,
      AttemptException.CALCULATING_SCORE,
    );
  }
}

export class AttemptTimeLimitExceededException extends BaseException {
  constructor() {
    super(
      `Time limit for attempt is up`,
      400,
      AttemptException.TIME_LIMIT_EXCEEDED,
    );
  }
}
