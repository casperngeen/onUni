import { Injectable } from '@nestjs/common';
import BaseService from 'src/base/base.service';
import { Test, TestById, TestIdDto } from './test.entity';
import { Repository } from 'typeorm';
import { Course, CourseIdDto } from '../course/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class TestService extends BaseService<Test> {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    loggerService: LoggerService,
  ) {
    super(testRepository, loggerService);
  }

  async viewAllTests(courseIdObject: CourseIdDto): Promise<TestById> {
    this.log(`Query all tests for course ${courseIdObject.courseId}`);
    this.log(`Querying DB...`);
    const course: Course = await this.courseRepository.find({
      relations: ['tests'],
      where: courseIdObject,
    })[0];
    const tests: Test[] = course.tests;
    this.log(`Found all tests for course: ${courseIdObject.courseId}`);
    this.log(`Formatting tests...`);
    const testsObject: TestById = tests.reduce((acc, test) => {
      // is it ok to have some fields with null?
      acc[test.testId] = {
        title: test.title,
        description: test.description,
        testType: test.testType,
        maxScore: test.maxScore,
        deadline: test.deadline,
        scoringFormat: test.scoringFormat,
        maxAttempt: test.maxAttempt,
        timeLimit: test.timeLimit,
      };
      return acc;
    }, {});
    this.log(`Tests for course: ${courseIdObject.courseId} formatted`);
    this.log(`Query all tests for course ${courseIdObject.courseId} completed`);
    return testsObject;
  }

  async viewTestInfo(testIdObject: TestIdDto): Promise<TestById> {
    this.log(`Query for test ${testIdObject.testId}`);
    this.log(`Querying DB...`);
    const test: Test = await this.findOne({ where: testIdObject });
    if (!test) {
      this.error(
        `Test ${testIdObject.testId} could not be found`,
        testIdObject.testId.toString(),
      );
    }
    this.log(`Test ${testIdObject.testId} found`);
    this.log(`Formatting test information...`);
    const testInfo: TestById = {};
    testInfo[test.testId] = {
      title: test.title,
      description: test.description,
      testType: test.testType,
      maxScore: test.maxScore,
      deadline: test.deadline,
      scoringFormat: test.scoringFormat,
      maxAttempt: test.maxAttempt,
      timeLimit: test.timeLimit,
    };
    this.log(`Test information formatted`);
    return testInfo;
  }
}
