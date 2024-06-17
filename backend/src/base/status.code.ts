/**
 * For all responses that have no issues
 */
export const OK = 0;

/**
 * General exceptions have prefix 1X
 */
export enum GeneralException {
  UNSPECIFIED = 10,
  INVALID_INPUT = 11,
  DATABASE_ERROR = 12,
}

/**
 * User exceptions have prefix 2X
 */
export enum UserException {
  DUPLICATE_USER = 21,
  UNAUTHORISED_USER = 22,
  USER_NOT_FOUND = 23,
}

/**
 * Auth exceptions have prefix 3X
 */
export enum AuthException {
  EXPIRED_TOKEN = 31,
  MAIL_NOT_SENT = 32,
  PASSWORD_INCORRECT = 33,
  HASH_FAILED = 34,
  TOKEN_GENERATION_FAILED = 35,
  NO_AUTHORIZATION_TOKEN = 36,
}

/**
 * Course exceptions have prefix 4X
 */
export enum CourseException {
  COURSE_NOT_FOUND = 41,
  ALREADY_IN_COURSE = 42,
  USER_NOT_IN_COURSE = 43,
  NOT_TEACHER_OF_COURSE = 44,
  NO_COURSE_ID = 45,
}

/**
 * Test exceptions have prefix 5X
 */
export enum TestException {
  TEST_NOT_FOUND = 51,
  NO_TESTS_IN_COURSE = 52,
  MAX_QUESTIONS = 53,
}

/**
 * Question exceptions have prefix 6X
 */
export enum QuestionException {
  QUESTION_NOT_FOUND = 61,
}

/**
 * Option exceptions have prefix 7X
 */
export enum OptionException {
  OPTION_NOT_FOUND = 71,
}

/**
 * Attempt exceptions have prefix 8X
 */
export enum AttemptException {
  ATTEMPT_NOT_FOUND = 81,
  TEST_NOT_ATTEMPTED = 82,
  ATTEMPT_LIMIT_REACHED = 83,
  ALREADY_SUBMITTED = 84,
  CALCULATING_SCORE = 85,
  TIME_LIMIT_EXCEEDED = 86,
}

/**
 * Attempt exceptions have prefix 9X
 */
export enum QuestionAttemptException {
  QUESTION_ATTEMPT_NOT_FOUND = 91,
  OPTION_NOT_IN_QUESTION = 92,
}
