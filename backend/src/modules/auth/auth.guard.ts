import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { UnauthorisedUserException } from '../user/user.exception';
import { PayloadDto } from '../user/user.entity';
import { Reflector } from '@nestjs/core';
import { ExpiredTokenException } from './auth.exception';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private loggerService: LoggerService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.loggerService.log(`Authenticating user details...`);
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    // access or refresh token
    const token: string = request.headers['authorization'].split(' ')[1];
    if (!token) {
      this.loggerService.error(`No token provided`, '');
      throw new UnauthorisedUserException();
    }
    this.loggerService.log(`Token provided: ${token}`);
    this.loggerService.log(`Verifying token...`);
    try {
      const payload: PayloadDto = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
      request['token'] = token;
      this.loggerService.log(
        `Token verified, user details and token added to request`,
      );
      this.loggerService.log(`User ${payload.userId} authenticated`);
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.loggerService.error(
          `Error verifying token ${token}`,
          error.message,
        );
        throw new ExpiredTokenException();
      }
      this.loggerService.error(`Error verifying token ${token}`, error.message);
      throw new UnauthorisedUserException();
    }
  }
}
