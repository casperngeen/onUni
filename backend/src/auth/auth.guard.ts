import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { UnauthorisedUserException } from '../exceptions/unauthorised.user.exception';
import { PayloadDto } from '../user/user.entity';
import { Reflector } from '@nestjs/core';
import { ExpiredTokenException } from 'src/exceptions/expired.token.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = request.cookies['accessToken'];
    if (!token) {
      throw new UnauthorisedUserException();
    }
    try {
      const payload: PayloadDto = await this.jwtService.verifyAsync(token);
      // request body will now have the payload
      request['user'] = payload;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ExpiredTokenException();
      }
    }
  }
}
