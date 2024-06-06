import { BaseException } from 'src/base/base.exception';
import { CourseException } from 'src/base/status.code';

export class CourseNotFoundException extends BaseException {
  constructor() {
    super(`Course not found`, 404, CourseException.COURSE_NOT_FOUND);
  }
}
