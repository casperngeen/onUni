import { BaseException } from 'src/base/base.exception';
import { CourseException } from 'src/base/status.code';

export class CourseNotFoundException extends BaseException {
  constructor() {
    super(`Course not found`, 404, CourseException.COURSE_NOT_FOUND);
  }
}

export class UserAlreadyInCourseException extends BaseException {
  constructor() {
    super(
      `User is already part of the course`,
      200,
      CourseException.ALREADY_IN_COURSE,
    );
  }
}

export class NoUserInCourseException extends BaseException {
  constructor() {
    super(`Course has no users`, 200, CourseException.NO_USER_IN_COURSE);
  }
}
