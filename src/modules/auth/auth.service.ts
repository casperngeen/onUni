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
  SignUpDto,
  User,
  UserIdDto,
} from '../user/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import bcrypt from 'bcrypt';
import {
  ExpiredTokenException,
  HashFailedExcepion,
  MailNotSentException,
  PasswordIncorrectException,
} from '../auth/auth.exception';
import nodemailer from 'nodemailer';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  DuplicateUserException,
  UserNotFoundException,
  UnauthorisedUserException,
} from '../user/user.exception';
import { InvalidInputException } from 'src/base/base.exception';

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

  /**
   * Request to login
   * @param loginDetails Object containing email and password
   * @returns The pair of authentication tokens generated
   */
  async login(loginDetails: LoginDto): Promise<AuthTokenDto> {
    this.log(`Log in query: ${loginDetails.email}`);
    // make it unique to user
    this.log(`Querying DB for email ${loginDetails.email}...`);
    const user: User = await this.findOne({ email: loginDetails.email });
    if (!user) {
      this.error('User not found', loginDetails.email);
      throw new UserNotFoundException();
    }
    this.log(`User ${user.userId} found`);
    this.log('Checking if passwords match...');
    const result: boolean = await bcrypt.compare(
      loginDetails.password,
      user.passwordHash,
    );
    if (!result) {
      this.error('Password incorrect', user.userId.toString());
      throw new PasswordIncorrectException();
    } else {
      this.log('Password verified');
      this.log('Generating authentication tokens...');
      const accessToken: string = await this.generateAccessToken(user);
      const refreshToken: string = await this.generateRefreshToken(user);
      // encrypt the refresh token
      this.log('Hashing and storing refresh token');
      await this.hashAndStore(user.userId, refreshToken);
      this.log('Hashing and storing refresh token completed');
      this.log(`Login for ${loginDetails.email} completed`);
      return { accessToken: accessToken, refreshToken: refreshToken };
    }
  }

  /**
   * Request to generate new access token
   * @param user User based on the user entity
   * @returns Promise resolving to the access token
   */
  async generateAccessToken(user: User): Promise<string> {
    const payload = {
      id: user.userId,
      role: user.role,
    };

    const options = { expiresIn: '15m' };
    this.log('Generating access token...');
    try {
      const result = await this.jwtService.signAsync(payload, options);
      this.log('Access token generated');
      return result;
    } catch (error) {
      this.error('Error generating access token', error);
    }
  }

  /**
   * Request to generate new refresh token
   * @param user User based on the user entity
   * @returns Promise resolving to the refresh token
   */
  async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      userId: user.userId,
      role: user.role,
    };

    const options = { expiresIn: '7d' };
    this.log('Generating refresh token...');
    try {
      const result = await this.jwtService.signAsync(payload, options);
      this.log('Refresh token generated');
      return result;
    } catch (error) {
      this.error('Error generating refresh token', error);
    }
  }

  /**
   * Request to sign up
   * @param signUpDetails Object containing role, password, email
   */
  async signUp(signUpDetails: SignUpDto): Promise<void> {
    this.log(`Sign up query: ${signUpDetails.email}`);
    this.log('Checking for duplicates...');
    const user: User = await this.findOne({ email: signUpDetails.email });
    if (user) {
      this.error('Duplicate user found', signUpDetails.email);
      throw new DuplicateUserException();
    }
    this.log('No duplicate user found');
    this.log('Checking password format...');
    if (!this.isValidPassword(signUpDetails.password)) {
      this.error('Password does not meet requirements', signUpDetails.email);
      throw new InvalidInputException();
    }
    this.log('Password meets requirements');
    this.log('Hashing password...');
    let hash: string;
    try {
      hash = await bcrypt.hash(signUpDetails.password, 10);
      this.log('Password hashed');
    } catch (error) {
      this.error('Hashing failed', error);
      throw new HashFailedExcepion();
    }

    this.log(`Inserting user ${signUpDetails.email} into DB...`);
    await this.insert({
      passwordHash: hash,
      role: signUpDetails.role,
      email: signUpDetails.email,
    });
    this.log('User successfully inserted');
    this.log(`Sign up for ${signUpDetails.email} completed`);
  }

  /**
   * Request to handle forget password
   * @param emailObject Object containing email
   */
  async forgetPassword(emailObject: EmailDto): Promise<void> {
    this.log(`Forget password query: ${emailObject.email}`);
    this.log('Finding user based on email...');
    const user: User = await this.findOne(emailObject);
    if (!user) {
      this.error('User not found', emailObject.email);
      throw new UserNotFoundException();
    }
    this.log(`User ${user.userId} found`);
    const emailToken: bigint = this.getEmailToken();
    this.log('Random token generated');
    this.log('Adding email token to DB...');
    await this.update(user.userId, { emailToken: emailToken });
    this.log('Added email token to DB');

    const link: string = `https://server/auth/change/${emailToken}`;
    // to be updated
    const message = {
      from: 'sender@server.com',
      to: `${emailObject.email}`,
      subject: '[OnUNI] Change Password',
      text: 'Click on the link to change your password',
      html: `<a href=${link}>Confirm email here</a>`,
    };
    this.log('Sending email to user...');
    try {
      const info = await this.transporter.sendEmail(message);
      if (!info) {
        this.error('Mail not sent', emailObject.email);
        throw new MailNotSentException();
      }
      this.log('Email sent');
      this.log(`Forgot password query for ${emailObject.email} completed`);
    } catch (error) {
      this.error('Error sending email', error);
      throw new MailNotSentException();
    }
  }

  /**
   * To generate a random token for the change password request
   * @returns The generated token
   */
  getEmailToken(): bigint {
    const myArray = new BigUint64Array(1);
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
  ): Promise<UpdateResult> {
    this.log(`Change password query: ${tokenObject.emailToken}`);
    this.log('Checking password format...');
    if (!this.isValidPassword(passwordDetails.password)) {
      this.error(
        'Password does not meet requirements',
        tokenObject.emailToken.toString(),
      );
      throw new InvalidInputException();
    }
    this.log('Password meets requirements');
    const userId: number = (await this.verifyToken(tokenObject)).userId;
    this.log('Hashing and storing new password...');
    const result = await this.hashAndStore(userId, passwordDetails.password);
    this.log('Hashed and stored new password');
    this.log(`Change password query for ${tokenObject.emailToken} completed`);
    return result;
  }

  /**
   * To verify if the user is allowed to change password or not
   * @param tokenObject Email token
   * @returns Promise resolving to userId
   */
  async verifyToken(tokenObject: EmailTokenDto): Promise<UserIdDto> {
    this.log(`Verify token query: ${tokenObject.emailToken}`);
    this.log('Finding user...');
    const user: User = await this.findOne({
      emailToken: tokenObject.emailToken,
    });
    if (!user) {
      this.error('User not found', tokenObject.emailToken.toString());
      throw new UserNotFoundException();
    }
    this.log(`User ${user.userId} found`);
    this.log('Removing token from DB...');
    this.update(user.userId, { emailToken: null });
    this.log('Token removed');
    this.log(`Token verification for ${tokenObject.emailToken} completed`);
    return { userId: user.userId };
  }

  /**
   * Request to refresh the authentication tokens
   * @param refreshToken The refresh token provided by client
   * @returns The new pair of tokens
   */
  async refresh(refreshToken: string): Promise<AuthTokenDto> {
    this.log(`Refresh tokens query for token: ${refreshToken}`);
    let payload: PayloadDto;
    this.log('Verifying token...');
    try {
      payload = this.jwtService.verify(refreshToken);
      this.log(`Token ${refreshToken} verified`);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.error(`Token ${refreshToken} has expired`, error.toString());
        throw new ExpiredTokenException();
      }
      this.error(`Error verifying token ${refreshToken}`, error);
      throw new UnauthorisedUserException();
    }

    this.log('Finding user with payload...');
    const user = await this.findOne({ userId: payload.userId });
    if (!user) {
      this.error('User not found', payload.userId.toString());
      throw new UserNotFoundException();
    }
    this.log(`User ${user.userId} found`);

    this.log(`Comparing token ${refreshToken} with hash...`);
    const result: boolean = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!result) {
      this.error(`Invalid token ${refreshToken}`, payload.userId.toString());
      throw new UnauthorisedUserException();
    }
    this.log(`Token ${refreshToken} is valid`);

    this.log('Generating new tokens...');
    const newAccessToken: string = await this.generateAccessToken(user);
    const newRefreshToken: string = await this.generateRefreshToken(user);

    this.log('Hashing and storing new refresh token...');
    await this.hashAndStore(user.userId, newRefreshToken);
    this.log('Hashing and storing refresh token completed');
    this.log(`Refresh tokens for ${refreshToken} query completed`);

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
  async hashAndStore(userId: number, item: string): Promise<UpdateResult> {
    const hash: string = await bcrypt.hash(item, 10);
    if (!hash) {
      this.error(`Hash for user ${userId} failed`, userId.toString());
      throw new HashFailedExcepion();
    }
    // store the refresh token in the repo
    return await this.update(userId, { refreshToken: hash });
  }

  /**
   * Request to log out from application
   * @param userId Id of the user requesting log out
   * @returns Promise resolving to UpdateResult
   */
  async logOut(userId: number): Promise<UpdateResult> {
    this.log(`Log out query: User ${userId}`);
    this.log(`Finding user ${userId}...`);
    const user: User = await this.findOne({ userId: userId });
    if (!user) {
      this.error(`User ${userId} not found`, userId.toString());
      throw new UserNotFoundException();
    }
    this.log(`User ${userId} found`);
    this.log('Removing refresh token from DB...');
    const result = await this.update(user.userId, { refreshToken: null });
    this.log('Refresh token removed');
    this.log(`Log out query for user ${userId} completed`);
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
