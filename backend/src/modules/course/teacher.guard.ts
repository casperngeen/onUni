import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { LoggerService } from '../logger/logger.service';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import { CourseService } from './course.service';
import { Course } from './course.entity';
import { CourseIdNotFoundException } from './course.exception';

@Injectable()
export class TeacherGuard implements CanActivate {
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
    const { userId, role } = request['user'];
    if (!request.body.courseId && !request.params.courseId) {
      this.loggerService.error(
        `Course ID not provided`,
        this.context,
        this.getTrace(),
      );
      throw new CourseIdNotFoundException();
    }
    let courseId: number;
    if (request.body.courseId) {
      courseId = request.body.courseId;
    } else {
      courseId = parseInt(request.params.courseId);
    }
    const course: Course = await this.courseService.isCourseInRepo(courseId);
    return this.courseService.isTeacherOfCourse(role, userId, course);
  }
}
