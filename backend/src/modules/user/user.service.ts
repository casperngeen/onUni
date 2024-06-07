import { Injectable } from '@nestjs/common';
import BaseService from 'src/base/base.service';
import { EmailDto, Roles, User, UserIdDto } from './user.entity';
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
  }

  /**
   * Finds all users of specific role in a specified course
   * @param id CourseId
   * @param role Role of User (Student/Teacher)
   * @returns Array of Users of the specified role for the specified course
   */
  async findUsersInCourse(id: number, role: Roles): Promise<User[]> {
    this.log(`Query all ${role}s for user ${id}`);
    this.log(`Querying DB...`);
    const users: User[] = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.courses', 'course', 'course.courseId = :id', { id })
      .getMany();
    users.filter((user) => user.role == role);
    this.log(`All ${role}s found for course ${id}`);
    this.log(`Formatting ${role} information for course ${id}`);
    users.map((user) => {
      return {
        userId: user.userId,
        email: user.email,
      };
    });
    this.log(`All ${role} information formatted for course ${id}`);
    this.log(`Query all ${role}s for course ${id} completed`);
    return users;
  }

  /**
   * Find students in a specific course
   * @param courseIdObject Object containing a specific course id
   * @returns Array of students in a specified course
   */
  async findStudentsInCourse(courseIdObject: CourseIdDto): Promise<User[]> {
    return await this.findUsersInCourse(courseIdObject.courseId, Roles.STUDENT);
  }

  /**
   * Find teachers in a specific course
   * @param courseIdObject Object containing a specific course id
   * @returns Array of teachers in a specified course
   */
  async findTeachersInCourse(courseIdObject: CourseIdDto): Promise<User[]> {
    return await this.findUsersInCourse(courseIdObject.courseId, Roles.TEACHER);
  }

  /**
   * Create new user with default password based on role and email
   * @param email String representing email
   * @param role Role of user (Student/Teacher)
   */
  async createNewUser(email: string, role: Roles): Promise<void> {
    this.log(`Query to create new ${role} with email ${email}`);
    this.log('Checking for duplicates...');
    const user: User = await this.findOne({ where: { email: email } });
    if (user) {
      this.error('Duplicate user found', email);
      throw new DuplicateUserException();
    }
    this.log('No duplicate user found');
    this.log('Hashing password...');
    let hash: string;
    try {
      hash = await bcrypt.hash(DEFAUlT_PASSWORD, 10);
      this.log('Password hashed');
    } catch (error) {
      this.error('Hashing failed', error);
      throw new HashFailedExcepion();
    }

    this.log(`Inserting user with email ${email} into DB...`);
    await this.upsert({
      passwordHash: hash,
      role: role,
      email: email,
    });
    this.log('User successfully inserted');
    this.log(`Query to create new ${role} with email ${email} completed`);
  }

  /**
   * Create new student with default password based on email
   * @param emailObject Object containing email
   */
  async createNewStudent(emailObject: EmailDto): Promise<void> {
    return await this.createNewUser(emailObject.email, Roles.STUDENT);
  }

  /**
   * Create new teacher with default password based on email
   * @param emailObject Object containing email
   */
  async createNewTeacher(emailObject: EmailDto): Promise<void> {
    return await this.createNewUser(emailObject.email, Roles.TEACHER);
  }

  async updateUserDetails() {}

  /**
   * Remove user from database based on user id
   * @param userIdObject Object containing user id
   */
  async removeUser(userIdObject: UserIdDto): Promise<void> {
    const userId = userIdObject.userId;
    this.log(`Query to remove user ${userId}`);
    this.log(`Checking if user ${userId} exists...`);
    const user: User = await this.findOne({ where: { userId: userId } });
    if (!user) {
      this.error(`User ${userId} does not exist`, userId.toString());
      throw new UserNotFoundException();
    }
    this.log(`User ${userId} exists`);
    this.log(`Deleting user ${userId} from DB...`);
    await this.delete(userId);
    this.log(`Deleted user ${userId} from DB`);
    this.log(`Query to remove user ${userId} completed`);
  }
}
