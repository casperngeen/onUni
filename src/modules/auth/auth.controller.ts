import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthTokenDto,
  EmailDto,
  LoginDto,
  PasswordDto,
  PayloadDto,
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

  @Public()
  @Get('forget')
  async forgetPassword(@Body() emailDto: EmailDto, @Res() response: Response) {
    await this.authService.forgetPassword(emailDto);
    response.status(200).json(ResponseHandler.success());
  }

  @Public()
  @Put('change/:token')
  async changePassword(
    @Param('token') token: bigint,
    @Body() password: PasswordDto,
    @Res() response: Response,
  ) {
    await this.authService.changePassword({ emailToken: token }, password);
    response.status(200).json(ResponseHandler.success());
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    const refreshToken: string = '';
    const tokens: AuthTokenDto = await this.authService.refresh(refreshToken);
    response.status(200).json(ResponseHandler.success(tokens));
  }

  @Post('logout')
  async logout(@Body('user') payload: PayloadDto, @Res() response: Response) {
    await this.authService.logOut(payload.userId);
    response.status(200).json(ResponseHandler.success());
  }
}
