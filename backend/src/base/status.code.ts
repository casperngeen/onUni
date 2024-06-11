/**
 * For all responses that have no issues
 */
export const OK = 0;

/**
 * General exceptions have prefix 1XX
 */
export enum GeneralException {
  UNSPECIFIED = 10,
  INVALID_INPUT = 11,
  DATABASE_ERROR = 12,
}

/**
 * User exceptions have prefix 2XX
 */
export enum UserException {
  DUPLICATE_USER = 21,
  UNAUTHORISED_USER = 22,
  USER_NOT_FOUND = 23,
}

/**
 * Auth exceptions have prefix 3XX
 */
export enum AuthException {
  EXPIRED_TOKEN = 31,
  MAIL_NOT_SENT = 32,
  PASSWORD_INCORRECT = 33,
  HASH_FAILED = 34,
  TOKEN_GENERATION_FAILED = 35,
}

/**
 * Course exceptions have prefix 4XX
 */
export enum CourseException {
  COURSE_NOT_FOUND = 41,
  ALREADY_IN_COURSE = 42,
  NO_USER_IN_COURSE = 43,
}
