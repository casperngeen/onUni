import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { LoggerService } from '../logger/logger.service';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import { AttemptService } from './attempt.service';
import { AttemptIdNotFoundException } from './attempt.exception';
import { Attempt } from './attempt.entity';
import { CourseService } from '../course/course.service';

@Injectable()
export class AttemptTeacherGuard implements CanActivate {
  private context: string;
  constructor(
    private attemptService: AttemptService,
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
    if (!request.params.attemptId) {
      this.loggerService.error(
        `Attempt ID not provided`,
        this.context,
        this.getTrace(),
      );
      throw new AttemptIdNotFoundException();
    }
    const attemptId: number = parseInt(request.params.attemptId);
    const attempt: Attempt =
      await this.attemptService.getAttemptFromRepo(attemptId);
    return (
      attempt.user.userId === userId ||
      this.courseService.isTeacherOfCourse(role, userId, attempt.test.course)
    );
  }
}
