import { Injectable } from '@nestjs/common';
import BaseService from 'src/base/base.service';
import {
  AddUserToCourseDto,
  AllCourseInfoDto,
  Course,
  CourseIdDto,
  CourseInfoWithTestsDto,
  NewCourseDetailsDto,
  UpdateCourseDto,
  ViewCourseInfoQueryDto,
} from './course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PayloadDto, User } from '../user/user.entity';
import {
  CourseNotFoundException,
  UserAlreadyInCourseException,
  UserNotInCourseException,
} from './course.exception';
import { UserNotFoundException } from '../user/user.exception';
import { LoggerService } from '../logger/logger.service';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import { DatabaseException } from 'src/base/base.exception';
import { Roles } from '../user/user.enum';
import { ScoringFormats, TestTypes } from '../test/test.enum';
import { Status } from '../attempt/attempt.enum';
import { NextTestDto } from '../test/test.entity';

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

  public async viewAllCoursesForUser(payload: PayloadDto) {
    const { userId, role } = payload;
    this.log(`Query all courses for user ${userId}`, this.context);
    this.log(`Querying DB...`, this.context);
    let courses: Course[];
    if (role === Roles.TEACHER) {
      courses = await this.courseRepository.find({
        relations: ['tests', 'tests.attempts', 'tests.attempts.user'],
      });
    } else {
      const user = await this.userRepository.findOne({
        where: { userId: userId },
        relations: [
          'courses',
          'courses.tests',
          'courses.tests.attempts',
          'courses.tests.attempts.user',
        ],
      });
      courses = user ? user.courses : null;
    }

    this.log(`All courses found for user ${userId}`, this.context);
    this.log(
      `Formatting course information for user ${userId}...`,
      this.context,
    );
    const courseInfo: AllCourseInfoDto[] = courses.map((course) =>
      this.formatCourseInfo(course, userId),
    );
    const sortedCourses = courseInfo.sort((x, y) => x.courseId - y.courseId);
    this.log(`Course information for user ${userId} formatted`, this.context);
    this.log(
      `Finding next uncompleted test for user ${userId}...`,
      this.context,
    );
    const index = sortedCourses.findIndex(
      (course) =>
        course.progress < 100 &&
        Date.parse(course.startDate) < Date.now() &&
        Date.parse(course.endDate) > Date.now(),
    );
    const suggestedTest =
      index === -1
        ? null
        : courses
            .find((course) => course.courseId === sortedCourses[index].courseId)
            .tests.sort((x, y) => x.testId - y.testId)
            .find(
              (test) =>
                test.attempts
                  .filter((attempt) => attempt.user.userId === userId)
                  .findIndex((attempt) => attempt.submitted !== null) === -1,
            );
    const formatTest: NextTestDto = suggestedTest
      ? {
          courseId: sortedCourses[index].courseId,
          testId: suggestedTest.testId,
          testType: suggestedTest.testType,
          testTitle: suggestedTest.title,
          courseTitle: sortedCourses[index].title,
        }
      : null;
    this.log(`Found next uncompleted test for user ${userId}`, this.context);
    this.log(`Query all courses for user ${userId} completed`, this.context);
    return {
      courses: sortedCourses,
      nextTest: formatTest,
    };
  }

  public async viewCourseInfoForUser(viewCourseInfo: ViewCourseInfoQueryDto) {
    const { courseId, userId } = viewCourseInfo;
    this.log(`Course info query for course ${courseId}`, this.context);
    const course: Course = await this.isCourseInRepo(courseId);
    this.log(
      `Formatting course information for course ${courseId}...`,
      this.context,
    );
    const courseInfo = this.formatCourseInfoWithTests(course, userId);
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
    newCourseDetails: NewCourseDetailsDto,
  ): Promise<CourseIdDto> {
    const { title, description, startDate, endDate } = newCourseDetails;
    this.log(`Query to create new course titled ${title}`, this.context);
    this.log(`Inserting into DB...`, this.context);
    const course: Course = await this.save({
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
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
          `User ${userId} is part of course ${course.courseId}`,
          this.context,
        )
      : this.log(
          `User ${userId} is not part of course ${course.courseId}`,
          this.context,
        );
    return userInCourse;
  }

  public async isCourseInRepo(courseId: number) {
    this.log(`Checking if course ${courseId} is in DB...`, this.context);
    const course: Course = await this.findOne({
      relations: ['tests', 'tests.attempts', 'tests.attempts.user', 'users'],
      where: { courseId: courseId },
      order: {
        tests: {
          testId: 'ASC',
        },
      },
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

  private formatCourseInfo(course: Course, userId: number): AllCourseInfoDto {
    const completed = course.tests.filter(
      (test) =>
        test.attempts
          .filter((attempt) => attempt.user.userId == userId)
          .findIndex((attempt) => attempt.submitted !== null) !== -1,
    ).length;
    const progress =
      course.tests.length === 0
        ? 0
        : Math.round((completed / course.tests.length) * 100);
    return {
      courseId: course.courseId,
      title: course.title,
      startDate: course.startDate,
      endDate: course.endDate,
      progress: progress,
    };
  }

  private formatCourseInfoWithTests(
    course: Course,
    userId: number,
  ): CourseInfoWithTestsDto {
    const tests = course.tests.map((test) => {
      let currScore = null;
      let numOfAttempts = 0;
      if (
        test.testType === TestTypes.EXAM &&
        test.scoringFormat !== ScoringFormats.HIGHEST
      ) {
        switch (test.scoringFormat) {
          case ScoringFormats.AVERAGE:
            let sum = 0;
            let numCompleted = 0;
            for (const attempt of test.attempts) {
              if (
                attempt &&
                (attempt.status === Status.SUBMIT ||
                  attempt.status === Status.AUTOSUBMIT)
              ) {
                sum += attempt.score;
                numCompleted++;
              }
            }
            if (numCompleted > 0) {
              currScore = Math.round((sum / numCompleted) * 100) / 100;
            }
          case ScoringFormats.LATEST:
            test.attempts.sort(
              (a, b) => Date.parse(b.submitted) - Date.parse(a.submitted),
            );
            for (const attempt of test.attempts) {
              if (
                attempt.status === Status.SUBMIT ||
                attempt.status === Status.AUTOSUBMIT
              ) {
                currScore = attempt.score;
                break;
              }
            }
        }
      } else {
        const userAttempts = test.attempts.filter(
          (attempt) => attempt.user.userId == userId,
        );
        numOfAttempts = userAttempts.length;
        for (const attempt of userAttempts) {
          if (
            attempt &&
            (attempt.status === Status.SUBMIT ||
              attempt.status === Status.AUTOSUBMIT)
          ) {
            currScore = Math.max(currScore, attempt.score);
          }
        }
      }
      return {
        testId: test.testId,
        testTitle: test.title,
        testDescription: test.description,
        testType: test.testType,
        maxScore: test.maxScore,
        start: test.start,
        deadline: test.deadline,
        scoringFormat: test.scoringFormat,
        maxAttempt: test.maxAttempt,
        timeLimit: test.timeLimit,
        currScore: currScore,
        numOfAttempts: numOfAttempts,
      };
    });
    return {
      courseId: course.courseId,
      title: course.title,
      description: course.description,
      startDate: course.startDate,
      endDate: course.endDate,
      tests: tests,
    };
  }
}
