import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { LoggerService } from '../logger/logger.service';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import { CourseService } from './course.service';
import { Course } from './course.entity';
import {
  CourseIdNotFoundException,
  UserNotInCourseException,
} from './course.exception';
import { PayloadDto } from '../user/user.entity';
import { Roles } from '../user/user.enum';

@Injectable()
export class CourseUserGuard implements CanActivate {
  private context: string;
  constructor(
    private courseService: CourseService,
    private loggerService: LoggerService,
  ) {
    this.context = StackTrace.getSync().map((frame) =>
      path.basename(frame.fileName),
    )[0];
  }

  protected getTrace(): string {
    const trace = StackTrace.getSync();
    return trace.map((frame) => frame.toString()).join('\n');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { role, userId } = request['user'] as PayloadDto;
    if (!request.query.courseId && !request.params.courseId) {
      this.loggerService.error(
        `Course ID not provided`,
        this.context,
        this.getTrace(),
      );
      throw new CourseIdNotFoundException();
    }
    if (role === Roles.STUDENT) {
      let courseId: number;
      if (request.query.courseId) {
        courseId = parseInt(request.query.courseId as string);
      } else {
        courseId = parseInt(request.params.courseId);
      }
      const course: Course = await this.courseService.isCourseInRepo(courseId);
      const userInCourse = this.courseService.isUserInCourse(userId, course);
      if (!userInCourse) {
        throw new UserNotInCourseException();
      }
      return userInCourse;
    }
    return true;
  }
}
