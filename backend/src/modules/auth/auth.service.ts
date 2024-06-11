import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseService from 'src/base/base.service';
import {
  AuthTokenDto,
  EmailDto,
  EmailTokenDto,
  LoginDto,
  PasswordDto,
  PayloadDto,
  RefreshDetailsDto,
  SignUpDto,
  User,
  UserIdDto,
} from '../user/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  HashFailedExcepion,
  MailNotSentException,
  PasswordIncorrectException,
  TokenGenerationFailedException,
} from '../auth/auth.exception';
// import nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import {
  DuplicateUserException,
  UserNotFoundException,
  UnauthorisedUserException,
} from '../user/user.exception';
import { InvalidInputException } from 'src/base/base.exception';
import { LoggerService } from '../logger/logger.service';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';

@Injectable()
export class AuthService extends BaseService<User> {
  //private transporter: any
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    loggerService: LoggerService,
  ) {
    super(userRepository, loggerService);
    this.context = StackTrace.getSync().map((frame) =>
      path.basename(frame.fileName),
    )[0];
    // to be updated
    // this.transporter = nodemailer.createTransport({
    //   pool: true,
    //   host: 'smtp.example.com',
    //   port: 465,
    //   secure: true, // TLS
    //   auth: {
    //     user: 'username',
    //     pass: 'password',
    //   },
    // });
  }

  /**
   * Request to login
   * @param loginDetails Object containing email and password
   * @returns The pair of authentication tokens generated
   */
  async login(loginDetails: LoginDto): Promise<AuthTokenDto> {
    this.log(`Log in query: ${loginDetails.email}`, this.context);
    // make it unique to user
    this.log(`Querying DB for email ${loginDetails.email}...,`, this.context);
    const user: User = await this.findOne({
      where: { email: loginDetails.email },
    });
    if (!user) {
      this.log(`${user}`, this.context);
      this.error(
        `User with email ${loginDetails.email} not found`,
        this.context,
        this.getTrace(),
      );
      throw new UserNotFoundException();
    }
    this.log(`User ${user.userId} found`, this.context);
    this.log('Checking if passwords match...', this.context);
    const result: boolean = await bcrypt.compare(
      loginDetails.password,
      user.passwordHash,
    );
    if (!result) {
      this.error('Password incorrect', this.context, this.getTrace());
      throw new PasswordIncorrectException();
    } else {
      this.log('Password verified', this.context);
      this.log('Generating authentication tokens...', this.context);
      const accessToken: string = await this.generateAccessToken(user);
      const refreshToken: string = await this.generateRefreshToken(user);
      // encrypt the refresh token
      this.log('Hashing and storing refresh token...', this.context);
      await this.hashAndStore(user.userId, refreshToken);
      this.log('Hashing and storing refresh token completed', this.context);
      this.log(`Login for ${loginDetails.email} completed`, this.context);
      return { accessToken: accessToken, refreshToken: refreshToken };
    }
  }

  /**
   * Request to generate new access token
   * @param user User based on the user entity
   * @returns Promise resolving to the access token
   */
  async generateAccessToken(user: User): Promise<string> {
    const payload: PayloadDto = {
      userId: user.userId,
      role: user.role,
    };

    // change back to shorter time later
    const options = { expiresIn: '10h' };
    this.log('Generating access token...', this.context);
    try {
      const result = await this.jwtService.signAsync(payload, options);
      this.log('Access token generated', this.context);
      return result;
    } catch (error) {
      this.error(
        `Error generating access token - ${error.toString()}`,
        this.context,
        this.getTrace(),
      );
      throw new TokenGenerationFailedException();
    }
  }

  /**
   * Request to generate new refresh token
   * @param user User based on the user entity
   * @returns Promise resolving to the refresh token
   */
  async generateRefreshToken(user: User): Promise<string> {
    const payload: PayloadDto = {
      userId: user.userId,
      role: user.role,
    };

    const options = { expiresIn: '7d' };
    this.log('Generating refresh token...', this.context);
    try {
      const result = await this.jwtService.signAsync(payload, options);
      this.log('Refresh token generated', this.context);
      return result;
    } catch (error) {
      this.error(
        `Error generating refresh token - ${error.toString()}`,
        this.context,
        this.getTrace(),
      );
      throw new TokenGenerationFailedException();
    }
  }

  /**
   * Request to sign up
   * @param signUpDetails Object containing role, password, email
   */
  async signUp(signUpDetails: SignUpDto): Promise<void> {
    this.log(`Sign up query: ${signUpDetails.email}`, this.context);
    this.log('Checking for duplicates...', this.context);
    const user: User = await this.findOne({
      where: {
        email: signUpDetails.email,
      },
    });
    if (user) {
      this.error('Duplicate user found', this.context, this.getTrace());
      throw new DuplicateUserException();
    }
    this.log('No duplicate user found', this.context);
    this.log('Checking password format...', this.context);
    if (!this.isValidPassword(signUpDetails.password)) {
      this.error(
        'Password does not meet requirements',
        this.context,
        this.getTrace(),
      );
      throw new InvalidInputException();
    }
    this.log('Password meets requirements', this.context);
    this.log('Hashing password...', this.context);
    let hash: string;
    try {
      hash = await bcrypt.hash(signUpDetails.password, 10);
      this.log('Password hashed', this.context);
    } catch (error) {
      this.error(`Hashing failed ${error}`, this.context, this.getTrace());
      throw new HashFailedExcepion();
    }

    this.log(`Inserting user ${signUpDetails.email} into DB...`, this.context);
    await this.insert({
      passwordHash: hash,
      role: signUpDetails.role,
      email: signUpDetails.email,
    });
    this.log('User successfully inserted', this.context);
    this.log(`Sign up for ${signUpDetails.email} completed`, this.context);
  }

  /**
   * Request to handle forget password
   * @param emailObject Object containing email
   */
  async forgetPassword(emailObject: EmailDto): Promise<void> {
    this.log(`Forget password query: ${emailObject.email}`, this.context);
    this.log('Finding user based on email...', this.context);
    const user: User = await this.findOne({ where: emailObject });
    if (!user) {
      this.error('User not found', this.context, this.getTrace());
      throw new UserNotFoundException();
    }
    this.log(`User ${user.userId} found`, this.context);
    const emailToken: number = this.getEmailToken();
    this.log('Random token generated', this.context);
    this.log('Adding email token to DB...', this.context);
    await this.update(user.userId, { emailToken: emailToken });
    this.log('Added email token to DB', this.context);

    // to be updated
    //const link: string = `https://server/auth/change/${emailToken}`;
    // const message = {
    //   from: 'sender@server.com',
    //   to: `${emailObject.email}`,
    //   subject: '[OnUNI] Change Password',
    //   text: 'Click on the link to change your password',
    //   html: `<a href=${link}>Confirm email here</a>`,
    // };
    this.log('Sending email to user...', this.context);
    try {
      // const info = await this.transporter.sendEmail(message);
      // if (!info) {
      //   this.error('Mail not sent', emailObject.email);
      //   throw new MailNotSentException();
      // }
      this.log('Email sent', this.context);
      this.log(
        `Forgot password query for ${emailObject.email} completed`,
        this.context,
      );
    } catch (error) {
      this.error('Error sending email', this.context, this.getTrace());
      throw new MailNotSentException();
    }
  }

  /**
   * To generate a random token for the change password request
   * @returns The generated token
   */
  getEmailToken(): number {
    const myArray = new Uint32Array(1);
    crypto.getRandomValues(myArray);
    return myArray[0];
  }

  /**
   * Request to change password
   * @param token The token for verification of the change password request
   * @param passwordDetails The new password
   * @returns UpdateResult promise
   */
  async changePassword(
    tokenObject: EmailTokenDto,
    passwordDetails: PasswordDto,
  ): Promise<void> {
    this.log(`Change password query: ${tokenObject.emailToken}`, this.context);
    this.log('Checking password format...', this.context);
    if (!this.isValidPassword(passwordDetails.password)) {
      this.error(
        'Password does not meet requirements',
        this.context,
        this.getTrace(),
      );
      throw new InvalidInputException();
    }
    this.log('Password meets requirements', this.context);
    const userId: number = (await this.verifyToken(tokenObject)).userId;
    this.log('Hashing and storing new password...', this.context);
    await this.hashAndStore(userId, passwordDetails.password);
    this.log('Hashed and stored new password', this.context);
    this.log(
      `Change password query for ${tokenObject.emailToken} completed`,
      this.context,
    );
  }

  /**
   * To verify if the user is allowed to change password or not
   * @param tokenObject Email token
   * @returns Promise resolving to userId
   */
  async verifyToken(tokenObject: EmailTokenDto): Promise<UserIdDto> {
    this.log(`Verify token query: ${tokenObject.emailToken}`, this.context);
    this.log('Finding user...', this.context);
    const user: User = await this.findOne({
      where: {
        emailToken: tokenObject.emailToken,
      },
    });
    if (!user) {
      this.error('User not found', this.context, this.getTrace());
      throw new UserNotFoundException();
    }
    this.log(`User ${user.userId} found`, this.context);
    this.log('Removing token from DB...', this.context);
    this.update(user.userId, { emailToken: null });
    this.log('Token removed', this.context);
    this.log(
      `Token verification for ${tokenObject.emailToken} completed`,
      this.context,
    );
    return { userId: user.userId };
  }

  /**
   * Request to refresh the authentication tokens
   * @param refreshToken The refresh token provided by client
   * @returns The new pair of tokens
   */
  async refresh(refreshDetails: RefreshDetailsDto): Promise<AuthTokenDto> {
    const { userId, refreshToken } = refreshDetails;
    this.log(`Refresh tokens query for user ${userId} `, this.context);
    this.log(`Finding user ${userId}...`, this.context);
    const user = await this.findOne({ where: { userId: userId } });
    if (!user) {
      this.error('User not found', this.context, this.getTrace());
      throw new UserNotFoundException();
    }
    this.log(`User ${userId} found`, this.context);

    if (!user.refreshToken) {
      this.error(
        `User ${user.userId} has already logged out`,
        this.context,
        this.getTrace(),
      );
      throw new UnauthorisedUserException();
    }

    this.log(`Comparing token with hash...`, this.context);
    // to compare against the token with reduced length
    const sha256 = crypto.createHash('sha256');
    const digest = sha256.update(refreshToken).digest('hex');
    const result: boolean = await bcrypt.compare(digest, user.refreshToken);

    if (!result) {
      this.error(`Invalid token`, this.context, this.getTrace());
      throw new UnauthorisedUserException();
    }
    this.log(`Token is valid`, this.context);

    this.log('Generating new tokens...', this.context);
    const newAccessToken: string = await this.generateAccessToken(user);
    const newRefreshToken: string = await this.generateRefreshToken(user);

    this.log('Hashing and storing new refresh token...', this.context);
    await this.hashAndStore(user.userId, newRefreshToken);
    this.log('Hashed and stored new refresh token', this.context);
    this.log(`Refresh tokens for user ${userId} query completed`, this.context);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * To hash and store the refresh token by userId
   * @param userId Id of the owner of the refresh token
   * @param item The refresh token
   * @returns Promise resolving to UpdateResult
   */
  async hashAndStore(userId: number, item: string): Promise<void> {
    // to reduce the length of the item to be hashed
    const sha256 = crypto.createHash('sha256');
    const digest = sha256.update(item).digest('hex');
    const hash: string = await bcrypt.hash(digest, 10);
    if (!hash) {
      this.error(
        `Hash for user ${userId} failed`,
        this.context,
        this.getTrace(),
      );
      throw new HashFailedExcepion();
    }
    this.log(`Hashed token: ${item}`, this.context);
    this.log(`Hash: ${hash}`, this.context);
    // store the refresh token in the repo
    await this.update(userId, { refreshToken: hash });
    this.log(`Updated DB with new token`, this.context);
  }

  /**
   * Request to log out from application
   * @param userId Id of the user requesting log out
   * @returns Promise resolving to UpdateResult
   */
  async logOut(userId: number): Promise<UpdateResult> {
    this.log(`Log out query: User ${userId}`, this.context);
    this.log(`Finding user ${userId}...`, this.context);
    const user: User = await this.findOne({ where: { userId: userId } });
    if (!user) {
      this.error(`User ${userId} not found`, this.context, this.getTrace());
      throw new UserNotFoundException();
    }
    this.log(`User ${userId} found`, this.context);
    this.log('Removing refresh token from DB...', this.context);
    const result = await this.update(user.userId, { refreshToken: null });
    this.log('Refresh token removed', this.context);
    this.log(`Log out query for user ${userId} completed`, this.context);
    return result;
  }

  isValidPassword(password: string): boolean {
    // one lower case, one upper case, one number, one special character, minimum 8 characters
    const passwordRegex = RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$',
    );
    return passwordRegex.test(password);
  }
}
