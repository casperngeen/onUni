import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { LoggerService } from '../logger/logger.service';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import { Roles } from '../user/user.enum';
import { UnauthorisedUserException } from '../user/user.exception';

@Injectable()
export class TeacherGuard implements CanActivate {
  private context: string;
  constructor(private loggerService: LoggerService) {
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
    const { role, userId } = request['user'];
    this.loggerService.log(
      `Checking if user ${userId} is allowed to create a new course...`,
      this.context,
    );
    if (role !== Roles.TEACHER) {
      this.loggerService.error(
        `User ${userId} is not authorised to create a new course`,
        this.context,
        this.getTrace(),
      );
      throw new UnauthorisedUserException();
    }
    this.loggerService.log(
      `User ${userId} is allowed to create a new course`,
      this.context,
    );
    return true;
  }
}
