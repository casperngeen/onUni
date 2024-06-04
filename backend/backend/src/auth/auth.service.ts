import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseService from 'src/base/base.service';
import {
  DoubleTokenDto,
  EmailDto,
  LoginDto,
  PasswordDto,
  PayloadDto,
  SignUpDto,
  SingleTokenDto,
  User,
} from 'src/user/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import bcrypt from 'bcrypt';
import { PasswordIncorrectException } from '../exceptions/password.incorrect.exception';
import { BaseException } from '../exceptions/base.exception';
import { DuplicateUserException } from '../exceptions/duplicate.user.exception';
import { UserNotFoundException } from '../exceptions/user.not.found.exception';
import nodemailer from 'nodemailer';
import { MailNotSentException } from '../exceptions/mail.not.sent.exception';
import { ExpiredTokenException } from '../exceptions/expired.token.exception';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UnauthorisedUserException } from '../exceptions/unauthorised.user.exception';

@Injectable()
export class AuthService extends BaseService<User> {
  private transporter: any;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    super(userRepository);
    // to be updated
    this.transporter = nodemailer.createTransport({
      pool: true,
      host: 'smtp.example.com',
      port: 465,
      secure: true, // TLS
      auth: {
        user: 'username',
        pass: 'password',
      },
    });
  }

  async login(loginDetails: LoginDto): Promise<DoubleTokenDto> {
    const user: User = await this.findOne(loginDetails);
    const result: boolean = await bcrypt.compare(
      loginDetails.password,
      user.passwordHash,
    );
    if (!result) {
      throw new PasswordIncorrectException();
    } else {
      const accessToken: string = await this.generateAccessToken(user);
      const refreshToken: string = await this.generateRefreshToken(user);
      // encrypt the refresh token
      await this.hashAndStore(user.userId, refreshToken);
      return { accessToken: accessToken, refreshToken: refreshToken };
    }
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = {
      id: user.userId,
      role: user.role,
    };

    const options = { expiresIn: '15m' };
    return await this.jwtService.signAsync(payload, options);
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      userId: user.userId,
      role: user.role,
    };

    const options = { expiresIn: '7d' };

    return await this.jwtService.signAsync(payload, options);
  }

  async signUp(signUpDetails: SignUpDto): Promise<User> {
    const user: User = await this.findOne(signUpDetails);
    if (user != null) {
      throw new DuplicateUserException();
    }
    await this.hashAndStore(user.userId, signUpDetails.password);
    return this.insert(user);
  }

  async forgetPassword(emailObject: EmailDto): Promise<boolean> {
    // check if email exists
    const user: User = await this.findOne(emailObject);
    if (user === null) {
      throw new UserNotFoundException();
    }
    const emailToken: string = await this.generateAccessToken(user);
    const expiryDate: Date = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    this.update(user.userId, { token: emailToken });

    const link: string = `https://server/auth/change/${emailToken}`;
    // to be updated
    const message = {
      from: 'sender@server.com',
      to: `${emailObject.email}`,
      subject: '[OnUNI] Change Password',
      text: 'Click on the link to change your password',
      html: `<a href=${link}>Confirm email here</a>`,
    };
    const info = await this.transporter.sendEmail(message);
    if (info === null) {
      throw new MailNotSentException();
    }
    return true;
  }

  async changePassword(
    token: SingleTokenDto,
    passwordDetails: PasswordDto,
  ): Promise<UpdateResult> {
    const userId: number = (await this.verifyToken(token)).userId;
    return await this.hashAndStore(userId, passwordDetails.password);
  }

  // to verify that user is allowed to change the password
  async verifyToken(tokenObject: SingleTokenDto): Promise<PayloadDto> {
    const user: User = await this.findOne({ token: tokenObject.accessToken });
    if (user === null) {
      throw new UserNotFoundException();
    } else {
      try {
        const payload: PayloadDto = this.jwtService.verify(
          tokenObject.accessToken,
        );
        this.update(user.userId, { token: null });
        return payload;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new ExpiredTokenException();
        }
      }
    }
  }

  // to generate new tokens
  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne(payload.userId);
      if (!user) {
        throw new UserNotFoundException();
      }

      const result: boolean = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!result) {
        throw new UnauthorisedUserException();
      }

      const newAccessToken: string = await this.generateAccessToken(user);
      const newRefreshToken: string = await this.generateRefreshToken(user);
      await this.hashAndStore(user.userId, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  async hashAndStore(userId: number, item: string): Promise<UpdateResult> {
    const hash: string = await bcrypt.hash(item, 10);
    if (!hash) {
      throw new BaseException('Unknown error', 400, 100);
    }
    // store the refresh token in the repo
    return await this.update(userId, { refreshToken: hash });
  }

  async logOut(userId: number): Promise<UpdateResult> {
    const user: User = await this.findOne({ userId: userId });
    if (!user) {
      throw new UserNotFoundException();
    }
    return await this.update(user.userId, { refreshToken: null });
  }
}
