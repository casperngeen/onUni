/**
 * For all responses that have no issues
 */
export const OK = 0;

/**
 * General exceptions have prefix 1XX
 */
export enum GeneralException {
  UNSPECIFIED = 100,
  INVALID_INPUT = 101,
}

/**
 * User exceptions have prefix 2XX
 */
export enum UserException {
  DUPLICATE_USER = 201,
  UNAUTHORISED_USER = 202,
  USER_NOT_FOUND = 203,
}

/**
 * Auth exceptions have prefix 3XX
 */
export enum AuthException {
  EXPIRED_TOKEN = 301,
  MAIL_NOT_SENT = 302,
  PASSWORD_INCORRECT = 303,
  HASH_FAILED = 304,
}
