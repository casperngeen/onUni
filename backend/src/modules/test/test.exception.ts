import { BaseException } from 'src/base/base.exception';
import { TestException } from 'src/base/status.code';

export class TestNotFoundException extends BaseException {
  constructor() {
    super(`Course not found`, 404, TestException.TEST_NOT_FOUND);
  }
}

export class NoTestsInCourseException extends BaseException {
  constructor() {
    super(`No tests in course`, 404, TestException.NO_TESTS_IN_COURSE);
  }
}

export class TestHasMaxQuestionsException extends BaseException {
  constructor() {
    super(
      `Test already has max number of questions. Delete a question, or increase the max score`,
      200,
      TestException.MAX_QUESTIONS,
    );
  }
}
