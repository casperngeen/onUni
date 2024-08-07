import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { UnauthorisedUserException } from '../user/user.exception';
import { PayloadDto } from '../user/user.entity';
import { Reflector } from '@nestjs/core';
import {
  AuthorizationTokenNotProvidedException,
  ExpiredTokenException,
} from './auth.exception';
import { LoggerService } from '../logger/logger.service';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AuthGuard implements CanActivate {
  private context: string;
  constructor(
    private jwtService: JwtService,
    private loggerService: LoggerService,
    private readonly reflector: Reflector,
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
    this.loggerService.log(`Authenticating user details...`, this.context);
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic || isRabbitContext(context)) {
      this.loggerService.log(`Route is public`, this.context);
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers['authorization']) {
      this.loggerService.error(
        'Authorization token not provided',
        this.context,
        this.getTrace(),
      );
      throw new AuthorizationTokenNotProvidedException();
    }
    // access or refresh token
    const token: string = request.headers['authorization'].split(' ')[1];
    if (!token) {
      this.loggerService.error(
        `No token provided`,
        this.context,
        StackTrace.getSync()
          .map((frame) => frame.toString())
          .join('\n'),
      );
      throw new UnauthorisedUserException();
    }
    this.loggerService.log(`Token provided`, this.context);
    this.loggerService.log(`Verifying token...`, this.context);
    try {
      const payload: PayloadDto = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
      request['token'] = token;
      this.loggerService.log(
        `Token verified, user details and token added to request`,
        this.context,
      );
      this.loggerService.log(
        `User ${payload.userId.toString()} authenticated`,
        this.context,
      );
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.loggerService.error(
          `JWT has expired`,
          this.context,
          StackTrace.getSync()
            .map((frame) => frame.toString())
            .join('\n'),
        );
        throw new ExpiredTokenException();
      }
      this.loggerService.error(
        `Error verifying token ${error.toString()}`,
        this.context,
        StackTrace.getSync()
          .map((frame) => frame.toString())
          .join('\n'),
      );
      throw new UnauthorisedUserException();
    }
  }
}
