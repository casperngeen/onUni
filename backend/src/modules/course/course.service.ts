import { Injectable } from '@nestjs/common';
import BaseService from 'src/base/base.service';
import {
  Course,
  CourseIdDto,
  NewCourseDto,
  UserCourseDto,
} from './course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserIdDto } from '../user/user.entity';
import { CourseNotFoundException } from './course.exception';
import { UserNotFoundException } from '../user/user.exception';

@Injectable()
export class CourseService extends BaseService<Course> {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(courseRepository);
  }

  async viewAllCoursesForUser(userIdObject: UserIdDto): Promise<Course[]> {
    this.log(`Query all courses for user ${userIdObject.userId}`);
    this.log(`Querying DB...`);
    const courses: Course[] = await this.courseRepository
      .createQueryBuilder('course')
      .innerJoin('course.users', 'user', 'user.userId = :userId', {
        userId: userIdObject.userId,
      })
      .getMany();

    this.log(`All courses found for user ${userIdObject.userId}`);
    this.log(
      `Formatting course information for user ${userIdObject.userId}...`,
    );
    courses.map((course) => {
      return {
        courseId: course.courseId,
        title: course.title,
        description: course.description,
        startDate: course.startDate,
        endDate: course.endDate,
      };
    });
    this.log(`Course information for user ${userIdObject.userId} formatted`);
    this.log(`Query all courses for user ${userIdObject.userId} completed`);
    return courses;
  }

  async viewCourseInfo(
    courseIdObject: CourseIdDto,
    viewUsers: boolean,
  ): Promise<Course> {
    this.log(`Course info query for course ${courseIdObject.courseId}`);
    this.log(`Querying DB...`);
    const course: Course = await this.findOne(courseIdObject);
    if (!course) {
      this.error(
        `Course ${courseIdObject.courseId} not found`,
        courseIdObject.courseId.toString(),
      );
      throw new CourseNotFoundException();
    }
    const courseInfo: Course = {
      courseId: course.courseId,
      title: course.title,
      description: course.description,
      startDate: course.startDate,
      endDate: course.endDate,
    };
    if (viewUsers) {
      courseInfo['users'] = course.users;
    }
    this.log(`Course ${courseIdObject.courseId} found`);
    this.log(
      `Course info query for course ${courseIdObject.courseId} completed`,
    );
    return courseInfo;
  }

  async createNewCourse(newCourseDetails: NewCourseDto) {
    const { title } = newCourseDetails;
    this.log(`Query to create new course titled ${title}`);
    this.log(`Inserting into DB...`);
    await this.insert(newCourseDetails);
    this.log(`Course ${title} inserted into DB`);
    this.log(`Query to create new course titled ${title} completed`);
  }

  async addUserToCourse(userCourse: UserCourseDto): Promise<void> {
    const { userId, courseId } = userCourse;
    this.log(`Query to add user ${userId} to course ${courseId}`);
    this.log(`Checking DB for user...`);
    const user: User = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!user) {
      this.error(`User ${userId} not found`, userId.toString());
      throw new UserNotFoundException();
    }
    this.log(`User ${userId} found`);
    this.log(`Checking DB for course...`);
    const course: Course = await this.findOne({ courseId: courseId });
    if (!course) {
      this.error(`Course ${courseId} not found`, courseId.toString());
      throw new CourseNotFoundException();
    }
    this.log(`Course ${courseId} found`);
    this.log(`Adding user ${userId} to course ${courseId}...`);
    course.users.push(user);
    await this.update(courseId, course);
    this.log(`User ${userId} added to course ${courseId}`);
    this.log(`Query to add user ${userId} to course ${courseId} completed`);
  }

  async removeUserFromCourse(userCourse: UserCourseDto): Promise<void> {
    const { userId, courseId } = userCourse;
    this.log(`Query to remove user ${userId} from course ${courseId}`);
    this.log(`Checking DB for course...`);
    const course: Course = await this.findOne({ courseId: courseId });
    if (!course) {
      this.error(`Course ${courseId} not found`, courseId.toString());
      throw new CourseNotFoundException();
    }
    this.log(`Course ${courseId} found`);
    this.log(`Removing user ${userId} from course ${courseId}...`);
    course.users.filter((user) => user.userId != userId);
    await this.update(courseId, course);
    this.log(`User ${userId} removed from course ${courseId}`);
    this.log(
      `Query to remove user ${userId} from course ${courseId} completed`,
    );
  }
}
