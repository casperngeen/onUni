import { Body, Controller, Param, Post, Put, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthTokenDto,
  EmailDto,
  LoginDto,
  PasswordDto,
  SignUpDto,
} from '../user/user.entity';
import { Public } from 'src/public.decorator';
import { Request, Response } from 'express';
import { ResponseHandler } from 'src/base/base.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDetails: LoginDto, @Res() response: Response) {
    const tokens: AuthTokenDto = await this.authService.login(loginDetails);
    response.status(200).json(ResponseHandler.success(tokens));
  }

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDetails: SignUpDto, @Res() response: Response) {
    await this.authService.signUp(signUpDetails);
    response.status(201).json(ResponseHandler.success());
  }

  // return url to change pw
  @Public()
  @Post('forget')
  async forgetPassword(@Body() email: EmailDto, @Res() response: Response) {
    await this.authService.forgetPassword(email);
    response.status(200).json(ResponseHandler.success());
  }

  @Public()
  @Put('changePassword/:token')
  async changePassword(
    @Param('token') token: number,
    @Body() password: PasswordDto,
    @Res() response: Response,
  ) {
    await this.authService.changePassword({ emailToken: token }, password);
    response.status(200).json(ResponseHandler.success());
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    const userId = request['user'].userId;
    const refreshToken = request['token'];
    const tokens: AuthTokenDto = await this.authService.refresh({
      userId: userId,
      refreshToken: refreshToken,
    });
    response.status(200).json(ResponseHandler.success(tokens));
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const { userId } = request['user'];
    await this.authService.logOut(userId);
    response.status(200).json(ResponseHandler.success());
  }
}
