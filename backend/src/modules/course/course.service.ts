import { Injectable } from '@nestjs/common';
import BaseService from 'src/base/base.service';
import {
  AddUserToCourseDto,
  Course,
  CourseIdDto,
  CourseInfoDto,
  NewCourseDto,
  UpdateCourseDto,
  ViewCourseDto,
} from './course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserIdDto } from '../user/user.entity';
import { Roles } from '../user/user.enum';
import {
  CourseNotFoundException,
  NotTeacherOfCourseException,
  UserAlreadyInCourseException,
  UserNotInCourseException,
} from './course.exception';
import {
  UnauthorisedUserException,
  UserNotFoundException,
} from '../user/user.exception';
import { LoggerService } from '../logger/logger.service';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import { DatabaseException } from 'src/base/base.exception';

@Injectable()
export class CourseService extends BaseService<Course> {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    loggerService: LoggerService,
  ) {
    super(courseRepository, loggerService);
    this.context = StackTrace.getSync().map((frame) =>
      path.basename(frame.fileName),
    )[0];
  }

  public async viewAllCoursesForUser(userIdObject: UserIdDto) {
    const { userId } = userIdObject;
    this.log(`Query all courses for user ${userIdObject.userId}`, this.context);
    this.log(`Querying DB...`, this.context);
    const courses: Course[] = await this.courseRepository
      .createQueryBuilder('course')
      .innerJoin('course.users', 'user', 'user.userId = :userId', {
        userId: userId,
      })
      .getMany();

    this.log(`All courses found for user ${userId}`, this.context);
    this.log(
      `Formatting course information for user ${userId}...`,
      this.context,
    );
    const courseInfo: CourseInfoDto[] = courses.map((course) =>
      this.formatCourseInfo(course),
    );
    this.log(`Course information for user ${userId} formatted`, this.context);
    this.log(`Query all courses for user ${userId} completed`, this.context);
    return courseInfo;
  }

  public async viewCourseInfo(
    viewCourseObject: ViewCourseDto,
    viewUsers: boolean,
  ) {
    const { courseId } = viewCourseObject;
    this.log(`Course info query for course ${courseId}`, this.context);
    const course: Course = await this.isCourseInRepo(courseId);
    this.log(
      `Formatting course information for course ${courseId}...`,
      this.context,
    );
    const courseInfo: CourseInfoDto = this.formatCourseInfo(course);
    if (viewUsers) {
      courseInfo['users'] = course.users;
    }
    this.log(
      `Course information for course ${courseId} formatted`,
      this.context,
    );
    this.log(
      `Course info query for course ${courseId} completed`,
      this.context,
    );
    return courseInfo;
  }

  public async createNewCourse(
    newCourseDetails: NewCourseDto,
  ): Promise<CourseIdDto> {
    const { title, description, startDate, endDate, role, adminId } =
      newCourseDetails;
    this.log(`Query to create new course titled ${title}`, this.context);
    if (role !== Roles.TEACHER) {
      this.error(
        `User ${adminId} is not authorised to create a new course`,
        this.context,
        this.getTrace(),
      );
      throw new UnauthorisedUserException();
    }
    this.log(`User ${adminId} is allowed to create a new course`, this.context);
    this.log(`Inserting into DB...`, this.context);
    const user: User = await this.isUserInRepo(adminId);
    const course: Course = await this.save({
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      users: [user],
      tests: [],
    });
    this.log(`Course ${title} inserted into DB`, this.context);
    this.log(
      `Query to create new course titled ${title} completed`,
      this.context,
    );
    return { courseId: course.courseId };
  }

  public async addUserToCourse(userCourse: AddUserToCourseDto) {
    const { userId, courseId } = userCourse;
    this.log(`Query to add user ${userId} to course ${courseId}`, this.context);
    const course: Course = await this.isCourseInRepo(courseId);
    this.log(`Current course details: ${JSON.stringify(course)}`, this.context);
    const user: User = await this.isUserInRepo(userId);
    const userInCourse: boolean = this.isUserInCourse(userId, course);

    if (userInCourse) {
      this.error(
        `Unable to add user ${userId} to course ${courseId} again`,
        this.context,
        this.getTrace(),
      );
      throw new UserAlreadyInCourseException();
    }

    course.users.push(user);
    this.log(
      `Updated user list: ${JSON.stringify(course.users)}`,
      this.context,
    );
    await this.save(course);
    this.log(`User ${userId} added to course ${courseId}`, this.context);
    this.log(
      `Query to add user ${userId} to course ${courseId} completed`,
      this.context,
    );
  }

  public async removeUserFromCourse(userCourse: AddUserToCourseDto) {
    const { userId, courseId } = userCourse;
    this.log(
      `Query to remove user ${userId} from course ${courseId}`,
      this.context,
    );
    const course: Course = await this.isCourseInRepo(courseId);
    const userInCourse = this.isUserInCourse(userId, course);
    if (!userInCourse) {
      throw new UserNotInCourseException();
    }

    this.log(
      `Removing user ${userId} from course ${courseId}...`,
      this.context,
    );
    course.users = course.users.filter((user) => user.userId != userId);
    await this.save(course);
    this.log(`User ${userId} removed from course ${courseId}`, this.context);
    this.log(
      `Query to remove user ${userId} from course ${courseId} completed`,
      this.context,
    );
  }

  public async deleteCourse(courseIdObject: CourseIdDto) {
    const { courseId } = courseIdObject;
    this.log(`Query to delete course ${courseId}`, this.context);
    this.log(`Deleting course ${courseId} from DB...`, this.context);
    await this.delete(courseId);
    this.log(`Course ${courseId} deleted from DB`, this.context);
    this.log(`Query to delete course ${courseId} completed`, this.context);
  }

  public async updateCourseInfo(updateCourseObject: UpdateCourseDto) {
    const { courseId } = updateCourseObject;
    this.log(`Query to update course ${courseId}`, this.context);
    this.log(`Updating course ${courseId}...`, this.context);
    await this.update(courseId, updateCourseObject);
    this.log(`Course ${courseId} updated in DB`, this.context);
    this.log(`Query to update course ${courseId} completed`, this.context);
  }

  public isUserInCourse(userId: number, course: Course) {
    this.log(
      `Checking if user ${userId} is part of course ${course.courseId}`,
      this.context,
    );
    let userInCourse: boolean = false;
    for (const user of course.users) {
      if (user.userId === userId) {
        userInCourse = true;
        break;
      }
    }
    userInCourse
      ? this.log(
          `User ${userId} is not part of course ${course.courseId}`,
          this.context,
        )
      : this.log(
          `User ${userId} is part of course ${course.courseId}`,
          this.context,
        );
    return userInCourse;
  }

  public isTeacherOfCourse(role: Roles, userId: number, course: Course) {
    this.log(
      `Checking if user ${userId} is a teacher of course ${course.courseId}...`,
      this.context,
    );
    const result =
      role === Roles.TEACHER && this.isUserInCourse(userId, course);
    if (!result) {
      this.error(
        `User ${userId} is not a teacher of course ${course.courseId}`,
        this.context,
        this.getTrace(),
      );
      throw new NotTeacherOfCourseException();
    }
    this.log(
      `User ${userId} is a teacher of course ${course.courseId}`,
      this.context,
    );
    return result;
  }

  public async isCourseInRepo(courseId: number) {
    this.log(`Checking if course ${courseId} is in DB...`, this.context);
    const course: Course = await this.findOne({
      relations: ['users'],
      where: { courseId: courseId },
    });
    if (!course) {
      this.error(`Course ${courseId} not found`, this.context, this.getTrace());
      throw new CourseNotFoundException();
    }
    this.log(`Course ${courseId} found`, this.context);
    return course;
  }

  private async isUserInRepo(userId: number) {
    this.log(`Checking DB for user ${userId}...`, this.context);
    let user: User;
    try {
      user = await this.userRepository.findOne({
        where: { userId: userId },
        relations: ['courses'],
      });
    } catch (error) {
      this.error(`${error}`, this.context, this.getTrace());
      throw new DatabaseException();
    }
    if (!user) {
      this.error(`User ${userId} not found`, this.context, this.getTrace());
      throw new UserNotFoundException();
    }
    this.log(`User ${userId} found`, this.context);
    return user;
  }

  private formatCourseInfo(course: Course): CourseInfoDto {
    return {
      courseId: course.courseId,
      title: course.title,
      description: course.description,
      startDate: course.startDate,
      endDate: course.endDate,
    };
  }
}
