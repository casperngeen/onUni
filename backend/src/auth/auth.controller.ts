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
  DoubleTokenDto,
  EmailDto,
  LoginDto,
  PasswordDto,
  PayloadDto,
  SignUpDto,
  User,
} from 'src/user/user.entity';
import { UpdateResult } from 'typeorm';
import { Public } from 'src/public.decorator';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDetails: LoginDto, @Res() res: Response) {
    const tokens: DoubleTokenDto = await this.authService.login(loginDetails);
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDetails: SignUpDto): Promise<User> {
    return await this.authService.signUp(signUpDetails);
  }

  @Public()
  @Get('forget')
  async forgetPassword(@Body() emailDto: EmailDto): Promise<boolean> {
    return await this.authService.forgetPassword(emailDto);
  }

  @Public()
  @Put('change/:token')
  async changePassword(
    @Param('token') token: string,
    @Body() password: PasswordDto,
  ): Promise<UpdateResult> {
    return await this.authService.changePassword(
      { accessToken: token },
      password,
    );
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken: string = req.cookies['refreshToken'];
    const tokens: DoubleTokenDto = await this.authService.refresh(refreshToken);
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @Post('logout')
  async logout(@Body('user') payload: PayloadDto, @Res() res: Response) {
    await this.authService.logOut(payload.userId);
    // clear the cookies
    res.cookie('accessToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(0),
    });
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(0),
    });
  }
}
