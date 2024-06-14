import { Injectable } from '@nestjs/common';
import BaseService from 'src/base/base.service';
import {
  Course,
  CourseIdDto,
  CourseInfoDto,
  NewCourseDto,
  UpdateCourseDto,
  UserCourseDto,
  ViewCourseDto,
} from './course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles, User, UserIdDto } from '../user/user.entity';
import {
  CourseNotFoundException,
  NoUserInCourseException,
  UserAlreadyInCourseException,
  UserNotInCourseException,
} from './course.exception';
import { UserNotFoundException } from '../user/user.exception';
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

  public async viewAllCoursesForUser(
    userIdObject: UserIdDto,
  ): Promise<CourseInfoDto[]> {
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
  ): Promise<CourseInfoDto> {
    const { courseId, userId } = viewCourseObject;
    this.log(`Course info query for course ${courseId}`, this.context);
    const course: Course = await this.isUserInCourse(userId, courseId);
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

  private formatCourseInfo(course: Course): CourseInfoDto {
    return {
      courseId: course.courseId,
      title: course.title,
      description: course.description,
      startDate: course.startDate,
      endDate: course.endDate,
    };
  }

  public async createNewCourse(
    newCourseDetails: NewCourseDto,
  ): Promise<CourseIdDto> {
    const { title } = newCourseDetails;
    this.log(`Query to create new course titled ${title}`, this.context);
    this.log(`Inserting into DB...`, this.context);
    const course: Course = await this.save({
      ...newCourseDetails,
      users: [],
      tests: [],
    });
    this.log(`Course ${title} inserted into DB`, this.context);
    this.log(
      `Query to create new course titled ${title} completed`,
      this.context,
    );
    return { courseId: course.courseId };
  }

  public async addUserToCourse(userCourse: UserCourseDto): Promise<void> {
    const { userId, courseId } = userCourse;
    this.log(`Query to add user ${userId} to course ${courseId}`, this.context);
    this.log(`Checking DB for user...`, this.context);
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
    const course: Course = await this.isCourseInRepo(courseId);
    this.log(`Current course details: ${JSON.stringify(course)}`, this.context);

    for (let i = 0; i < course.users.length; i++) {
      if (course.users[i].userId === userId) {
        this.error(
          `User ${userId} is already in course ${courseId}`,
          this.context,
          this.getTrace(),
        );
        throw new UserAlreadyInCourseException();
      }
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

  public async removeUserFromCourse(userCourse: UserCourseDto): Promise<void> {
    const { userId, courseId } = userCourse;
    this.log(
      `Query to remove user ${userId} from course ${courseId}`,
      this.context,
    );
    this.log(`Checking DB for course...`, this.context);
    const course: Course = await this.findOne({
      where: { courseId: courseId },
      relations: ['users'],
    });
    if (!course) {
      this.error(`Course ${courseId} not found`, this.context, this.getTrace());
      throw new CourseNotFoundException();
    }
    this.log(`Course ${courseId} found`, this.context);

    if (course.users.length === 0) {
      this.error(
        `Course ${courseId} has no users`,
        this.context,
        this.getTrace(),
      );
      throw new NoUserInCourseException();
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

  public async deleteCourse(courseIdObject: CourseIdDto): Promise<void> {
    const { courseId } = courseIdObject;
    this.log(`Query to delete course ${courseId}`, this.context);
    await this.isCourseInRepo(courseId);
    this.log(`Deleting course ${courseId} from DB...`, this.context);
    // delete the course
    await this.delete(courseId);
    this.log(`Course ${courseId} deleted from DB`, this.context);
    this.log(`Query to delete course ${courseId} completed`, this.context);
  }

  public async updateCourseInfo(updateCourseObject: UpdateCourseDto) {
    const { courseId } = updateCourseObject;
    this.log(`Query to update course ${courseId}`, this.context);
    await this.isCourseInRepo(courseId);
    this.log(`Updating course ${courseId}...`, this.context);
    await this.update(courseId, updateCourseObject);
    this.log(`Course ${courseId} updated in DB`, this.context);
    this.log(`Query to update course ${courseId} completed`, this.context);
  }

  public async isUserInCourse(userId: number, courseId: number) {
    const course: Course = await this.isCourseInRepo(courseId);
    this.log(
      `Checking if user ${userId} is allowed to view course ${courseId}`,
      this.context,
    );
    let userInCourse: boolean = false;
    for (const user of course.users) {
      if (user.userId === userId) {
        userInCourse = true;
        break;
      }
    }
    if (!userInCourse) {
      this.error(
        `User ${userId} is not part of course ${courseId}`,
        this.context,
        this.getTrace(),
      );
      throw new UserNotInCourseException();
    }
    this.log(
      `User ${userId} is allowed to view course ${courseId}`,
      this.context,
    );
    return course;
  }

  public isTeacherInCourse(role: Roles, userId: number, courseId: number) {
    return role === Roles.TEACHER && this.isUserInCourse(userId, courseId);
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
}
