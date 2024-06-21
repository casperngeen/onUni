import { Injectable } from '@nestjs/common';
import BaseService from 'src/base/base.service';
import { NewUserDto, User, UserIdDto } from './user.entity';
import { Roles } from './user.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseIdDto } from '../course/course.entity';
import {
  DuplicateUserException,
  UserNotFoundException,
} from './user.exception';
import * as bcrypt from 'bcrypt';
import { HashFailedExcepion } from '../auth/auth.exception';
import { LoggerService } from '../logger/logger.service';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';

// store in env?
const DEFAUlT_PASSWORD = 'Onuni123!';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    loggerService: LoggerService,
  ) {
    super(userRepository, loggerService);
    this.context = StackTrace.getSync().map((frame) =>
      path.basename(frame.fileName),
    )[0];
  }

  /**
   * Finds all users of specific role in a specified course
   * @param id CourseId
   * @param role Role of User (Student/Teacher)
   * @returns Array of Users of the specified role for the specified course
   */
  private async findUsersInCourse(
    id: number,
    role: Roles,
  ): Promise<Partial<User>[]> {
    this.log(`Query all ${role}s for user ${id}`, this.context);
    this.log(`Querying DB...`, this.context);
    const users: User[] = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.courses', 'course', 'course.courseId = :id', { id })
      .getMany();
    users.filter((user) => user.role == role);
    this.log(`All ${role}s found for course ${id}`, this.context);
    this.log(`Formatting ${role} information for course ${id}`, this.context);
    const userInfo = users.map((user) => {
      return {
        userId: user.userId,
        email: user.email,
        profilePic: user.profilePic,
      };
    });
    this.log(
      `All ${role} information formatted for course ${id}`,
      this.context,
    );
    this.log(`Query all ${role}s for course ${id} completed`, this.context);
    return userInfo;
  }

  /**
   * Find students in a specific course
   * @param courseIdObject Object containing a specific course id
   * @returns Array of students in a specified course
   */
  public async findStudentsInCourse(
    courseIdObject: CourseIdDto,
  ): Promise<Partial<User>[]> {
    return await this.findUsersInCourse(courseIdObject.courseId, Roles.STUDENT);
  }

  /**
   * Find teachers in a specific course
   * @param courseIdObject Object containing a specific course id
   * @returns Array of teachers in a specified course
   */
  public async findTeachersInCourse(
    courseIdObject: CourseIdDto,
  ): Promise<Partial<User>[]> {
    return await this.findUsersInCourse(courseIdObject.courseId, Roles.TEACHER);
  }

  /**
   * Create new user with default password based on role and email
   * @param email String representing email
   * @param role Role of user (Student/Teacher)
   */
  private async createNewUser(email: string, role: Roles): Promise<UserIdDto> {
    this.log(`Query to create new ${role} with email ${email}`, this.context);
    this.log('Checking for duplicates...', this.context);
    const user: User = await this.findOne({ where: { email: email } });
    if (user) {
      this.error('Duplicate user found', this.context, this.getTrace());
      throw new DuplicateUserException();
    }
    this.log('No duplicate user found', this.context);
    this.log('Hashing password...', this.context);
    let hash: string;
    try {
      hash = await bcrypt.hash(DEFAUlT_PASSWORD, 10);
      this.log('Password hashed', this.context);
    } catch (error) {
      this.error('Hashing failed', this.context, this.getTrace());
      throw new HashFailedExcepion();
    }

    this.log(`Inserting user with email ${email} into DB...`, this.context);
    const newUser: User = await this.save({
      passwordHash: hash,
      role: role,
      email: email,
      profilePic: null,
      courses: [],
      attempts: [],
    });
    this.log('User successfully inserted', this.context);
    this.log(
      `Query to create new ${role} with email ${email} completed`,
      this.context,
    );
    return { userId: newUser.userId };
  }

  /**
   * Create new student with default password based on email
   * @param emailObject Object containing email
   */
  public async createNewStudent(userDetails: NewUserDto): Promise<UserIdDto> {
    return await this.createNewUser(userDetails.email, Roles.STUDENT);
  }

  /**
   * Create new teacher with default password based on email
   * @param emailObject Object containing email
   */
  public async createNewTeacher(userDetails: NewUserDto): Promise<UserIdDto> {
    return await this.createNewUser(userDetails.email, Roles.TEACHER);
  }

  async updateUserDetails() {}

  /**
   * Remove user from database based on user id
   * @param userIdObject Object containing user id
   */
  public async removeUser(userIdObject: UserIdDto): Promise<void> {
    const userId = userIdObject.userId;
    this.log(`Query to remove user ${userId}`, this.context);
    this.log(`Checking if user ${userId} exists...`, this.context);
    const user: User = await this.findOne({ where: { userId: userId } });
    if (!user) {
      this.error(
        `User ${userId} does not exist`,
        this.context,
        this.getTrace(),
      );
      throw new UserNotFoundException();
    }
    this.log(`User ${userId} exists`, this.context);
    this.log(`Deleting user ${userId} from DB...`, this.context);
    await this.delete(userId);
    this.log(`Deleted user ${userId} from DB`, this.context);
    this.log(`Query to remove user ${userId} completed`, this.context);
  }
}
