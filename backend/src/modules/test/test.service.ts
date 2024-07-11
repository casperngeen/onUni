import { Injectable } from '@nestjs/common';
import BaseService from 'src/base/base.service';
import {
  NewTestDto,
  Test,
  TestIdDto,
  TestInfoDto,
  TestInfoWithHistoryDto,
  UpdateTestDto,
} from './test.entity';
import { Repository } from 'typeorm';
import { Course, CourseIdDto } from '../course/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '../logger/logger.service';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import { CourseNotFoundException } from '../course/course.exception';
import { TestNotFoundException } from './test.exception';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { AttemptHistory } from '../attempt/attempt.entity';

@Injectable()
export class TestService extends BaseService<Test> {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRedis()
    private readonly redis: Redis,
    loggerService: LoggerService,
  ) {
    super(testRepository, loggerService);
    this.context = StackTrace.getSync().map((frame) =>
      path.basename(frame.fileName),
    )[0];
  }

  public async viewAllTests(courseIdObject: CourseIdDto) {
    const { courseId } = courseIdObject;
    this.log(
      `Query all tests for course ${courseIdObject.courseId}`,
      this.context,
    );
    this.log(`Querying DB...`, this.context);
    const course: Course = await this.courseRepository.findOne({
      relations: ['tests'],
      where: courseIdObject,
    });
    if (!course) {
      this.error(
        `Course ${courseId} cannot be found`,
        this.context,
        this.getTrace(),
      );
      throw new CourseNotFoundException();
    }
    const tests: Test[] = course.tests;
    this.log(
      `Found all tests for course: ${courseIdObject.courseId}`,
      this.context,
    );
    this.log(`Formatting tests...`, this.context);
    const testsObject: TestInfoDto[] = tests
      .map((test) => {
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
        };
      })
      .sort((a, b) => a.testId - b.testId);
    this.log(
      `Tests for course: ${courseIdObject.courseId} formatted`,
      this.context,
    );
    this.log(
      `Query all tests for course ${courseIdObject.courseId} completed`,
      this.context,
    );
    return testsObject;
  }

  public async viewTestInfo(testIdObject: TestIdDto) {
    this.log(`Query for test ${testIdObject.testId}`, this.context);
    this.log(`Querying DB...`, this.context);
    const test: Test = await this.findOne({
      relations: ['attempts', 'course'],
      where: testIdObject,
    });
    if (!test) {
      this.error(
        `Test ${testIdObject.testId} could not be found`,
        this.context,
        this.getTrace(),
      );
    }
    this.log(`Test ${testIdObject.testId} found`, this.context);
    this.log(`Formatting test information...`, this.context);

    const attempts: AttemptHistory[] = test.attempts
      .map((attempt) => {
        return {
          attemptId: attempt.attemptId,
          status: attempt.status,
          submitted: attempt.submitted,
          score: attempt.score,
        };
      })
      .sort((x, y) => Date.parse(x.submitted) - Date.parse(y.submitted));

    const testInfo: TestInfoWithHistoryDto = {
      testId: test.testId,
      courseTitle: test.course.title,
      testTitle: test.title,
      testDescription: test.description,
      testType: test.testType,
      maxScore: test.maxScore,
      start: test.start,
      deadline: test.deadline,
      scoringFormat: test.scoringFormat,
      maxAttempt: test.maxAttempt,
      timeLimit: test.timeLimit,
      attempts: attempts,
    };
    this.log(`Test information formatted`, this.context);
    return testInfo;
  }

  public async createNewTest(newTestDetails: NewTestDto): Promise<TestIdDto> {
    const {
      courseId,
      testDescription: description,
      testTitle: title,
      ...testInfo
    } = newTestDetails;
    this.log(`Query to create new test`, this.context);
    this.log(`Checking DB for course...`, this.context);
    const course: Course = await this.courseRepository.findOne({
      where: { courseId: courseId },
    });
    if (!course) {
      this.error(`Course ${courseId} not found`, this.context, this.getTrace());
      throw new CourseNotFoundException();
    }
    this.log(`Course ${courseId} found`, this.context);
    this.log(`Creating new test under course ${courseId}`, this.context);
    const newTest = {
      ...testInfo,
      description: description,
      title: title,
      course: course,
      questions: [],
      attempts: [],
    };
    const test: Test = await this.save(newTest);
    this.log(`Added new test to DB`, this.context);
    this.log(`Query to create new test completed`, this.context);
    return { testId: test.testId };
  }

  public async updateTestInfo(updateTestDetails: UpdateTestDto): Promise<void> {
    const { testId, ...testInfo } = updateTestDetails;
    this.log(
      `Query to update test information for test ${testId}`,
      this.context,
    );
    this.log(`Checking DB for test...`, this.context);
    const test: Test = await this.findOne({
      where: { testId: testId },
    });
    if (!test) {
      this.error(`Test ${testId} not found`, this.context, this.getTrace());
      throw new TestNotFoundException();
    }
    this.log(`Test ${testId} found`, this.context);
    this.log(`Updating test information of test ${testId}`, this.context);
    await this.update(testId, testInfo);
    this.log(`Updated test ${testId} in DB`, this.context);
    this.log(
      `Query to update test information for test ${testId} completed`,
      this.context,
    );
  }

  public async deleteTest(testIdObject: TestIdDto): Promise<void> {
    const { testId } = testIdObject;
    this.log(`Query to delete test ${testId}`, this.context);
    this.log(`Checking DB for test...`, this.context);
    const test: Test = await this.findOne({
      where: { testId: testId },
    });
    if (!test) {
      this.error(`Test ${testId} not found`, this.context, this.getTrace());
      throw new TestNotFoundException();
    }
    this.log(`Test ${testId} found`, this.context);
    this.log(`Deleting test ${testId} from DB...`, this.context);
    await this.delete(testId);
    this.log(`Test ${testId} deleted from DB`, this.context);
    this.log(`Query to delete test ${testId}`, this.context);
  }
}
