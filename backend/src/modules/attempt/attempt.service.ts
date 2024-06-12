import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  Attempt,
  AttemptIdDto,
  AttemptInfoDto,
  NewAttemptDto,
  Status,
  SubmitAttemptDto,
  UserTestDto,
} from './attempt.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AnswerStatus,
  QuestionAttempt,
  QuestionAttemptResponseDto,
  SubmitQuestionAttemptDto,
} from './question.attempt.entity';
import { Test } from '../test/test.entity';
import { User } from '../user/user.entity';
import { LoggerService } from '../logger/logger.service';
import BaseService from 'src/base/base.service';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import { Question } from '../question/question.entity';
import {
  AttemptNotFoundException,
  OptionNotInQuestionException,
  QuestionAttemptNotFoundException,
  ReachedAttemptLimitException,
  TestNotAttemptedException,
} from './attempt.exception';
import { UserNotFoundException } from '../user/user.exception';
import { TestNotFoundException } from '../test/test.exception';
import { Option } from '../question/option.entity';

@Injectable()
export class AttemptService extends BaseService<Attempt> {
  constructor(
    @InjectRepository(Attempt)
    private readonly attemptRepository: Repository<Attempt>,

    @InjectRepository(QuestionAttempt)
    private readonly questionAttemptRepository: Repository<QuestionAttempt>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    loggerService: LoggerService,
  ) {
    super(attemptRepository, loggerService);
    this.context = StackTrace.getSync().map((frame) =>
      path.basename(frame.fileName),
    )[0];
  }

  async createNewAttempt(newAttemptDetails: NewAttemptDto): Promise<void> {
    const { start, end, testId, userId } = newAttemptDetails;
    this.log(
      `Query to create new attempt for user ${userId} for test ${testId}`,
      this.context,
    );
    this.log(`Checking for test ${testId} in DB...`, this.context);
    const test: Test = await this.testRepository.findOne({
      where: { testId: testId },
    });
    if (!test) {
      this.error(
        `Test ${testId} cannot be found`,
        this.context,
        this.getTrace(),
      );
      throw new TestNotFoundException();
    }
    this.log(`Test ${testId} found`, this.context);
    this.log(`Checking for user ${userId} in DB...`, this.context);
    const user: User = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!user) {
      this.error(
        `User ${userId} cannot be found`,
        this.context,
        this.getTrace(),
      );
      throw new UserNotFoundException();
    }
    this.log(`User ${userId} found`, this.context);
    this.log(
      `Checking if user ${userId} has reached attempt limit for test ${testId}`,
      this.context,
    );
    if (test.maxAttempt > 0) {
      const prevAttempts: Attempt[] = await this.attemptRepository
        .createQueryBuilder('attempt')
        .innerJoin('attempt.users', 'user', 'user.userId = :userId', {
          userId: userId,
        })
        .innerJoin('attempt.tests', 'test', 'test.testId =: testId', {
          testId: testId,
        })
        .getMany();
      if (prevAttempts.length >= test.maxAttempt) {
        this.error(
          `User ${userId} has already reached attempt limit for test ${testId}`,
          this.context,
          this.getTrace(),
        );
        throw new ReachedAttemptLimitException();
      }
    }
    this.log(
      `User ${userId} has not reached attempt limit for test ${testId}`,
      this.context,
    );
    this.log(
      `Creating and inserting new attempt for test ${testId} for user ${userId} into DB`,
      this.context,
    );
    const attempt: Attempt = await this.save({
      start: start,
      end: end,
      questionAttempts: [],
      test: test,
      user: user,
    });
    this.log(
      `Created and inserted new attempt for test ${testId} for user ${userId} into DB`,
      this.context,
    );
    this.log(
      `Creating and inserting new question attempts for all questions in test ${testId}`,
      this.context,
    );
    for (const question of test.questions) {
      await this.questionAttemptRepository.insert({
        question: question,
        attempt: attempt,
      });
    }
    this.log(
      `Created and inserted new question attempts for all questions in test ${testId}`,
      this.context,
    );
    this.log(
      `Query to create new attempt for user ${userId} for test ${testId} completed`,
      this.context,
    );
  }

  async getAllAttempts(
    userTestDetails: UserTestDto,
  ): Promise<AttemptInfoDto[]> {
    const { userId, testId } = userTestDetails;
    this.log(
      `Query to get all attempts of test ${testId} for user ${userId}`,
      this.context,
    );
    this.log(`Checking for user ${userId} in DB...`, this.context);
    const user: User = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!user) {
      this.error(
        `User  ${userId} cannot be found`,
        this.context,
        this.getTrace(),
      );
      throw new UserNotFoundException();
    }
    this.log(`User ${userId} found`, this.context);

    // // check if test is part of user.courses.tests
    // this.log(
    //   `Checking if test ${testId} is associated with user ${userId}`,
    //   this.context,
    // );
    // const tests: Test[] = user.courses.flatMap((course) => course.tests);
    // let found: boolean = false;
    // for (const test of tests) {
    //   if (test.testId === testId) {
    //     found = true;
    //     break;
    //   }
    // }
    // if (!found) {
    //   this.error(
    //     `Test ${testId} is not associated with user ${userId}`,
    //     this.context,
    //     this.getTrace(),
    //   );
    //   throw new TestNotAssociatedWithUserException();
    // }
    // this.log(`Test ${testId} is associated with user ${userId}`, this.context);

    // filter user.attempts to retrieve all attempts for this test
    this.log(`Filtering for attempts of test ${testId}...`, this.context);
    const attempts: Attempt[] = user.attempts.filter(
      (attempt) => attempt.test.testId === testId,
    );

    if (attempts.length === 0) {
      this.error(
        `User ${userId} has not attempted test ${testId}`,
        this.context,
        this.getTrace(),
      );
      throw new TestNotAttemptedException();
    }
    this.log(`Attempts of test ${testId} obtained`, this.context);
    this.log(`Formatting attempts of test ${testId}...`, this.context);
    const attemptsInfo: AttemptInfoDto[] = attempts.map((attempt) => {
      return {
        attemptId: attempt.attemptId,
        status: attempt.status,
        start: attempt.start,
        end: attempt.end,
        submitted: attempt.submitted,
        score: attempt.score,
        questionAttempts: attempt.questionAttempts.map((qAttempt) => {
          return {
            questionId: qAttempt.question.questionId,
            selectedOptionId: qAttempt.selectedOptionId,
            answerStatus: qAttempt.answerStatus,
          };
        }),
      };
    });
    this.log(`Attempts of test ${testId} formatted`, this.context);
    this.log(
      `Query to get all attempts of test ${testId} for user ${userId} completed`,
      this.context,
    );
    return attemptsInfo;
  }

  async getAttempt(attemptIdObject: AttemptIdDto): Promise<AttemptInfoDto> {
    const { attemptId } = attemptIdObject;
    this.log(`Query to get attempt ${attemptId}`, this.context);
    const attempt: Attempt = await this.checkIfAttemptInRepo(attemptId);
    this.log(
      `Formatting question attempts for attempt ${attemptId}...`,
      this.context,
    );
    const questionAttemptResponse: QuestionAttemptResponseDto[] =
      attempt.questionAttempts.map((qAttempt) => {
        return {
          questionId: qAttempt.question.questionId,
          selectedOptionId: qAttempt.selectedOptionId,
          answerStatus: qAttempt.answerStatus,
        };
      });
    this.log(
      `Formatting attempt info for attempt ${attemptId}...`,
      this.context,
    );
    const attemptInfo: AttemptInfoDto = {
      attemptId: attempt.attemptId,
      status: attempt.status,
      start: attempt.start,
      end: attempt.end,
      submitted: attempt.submitted,
      score: attempt.score,
      questionAttempts: questionAttemptResponse,
    };
    this.log(`Query to get attempt ${attemptId} completed`, this.context);
    return attemptInfo;
  }

  async submitAttempt(submitAttemptDetails: SubmitAttemptDto) {
    const { attemptId, submitted, questionAttempts } = submitAttemptDetails;
    this.log(`Query to update attempt ${attemptId}`, this.context);
    const attempt: Attempt = await this.checkIfAttemptInRepo(attemptId);
    this.log(`Updating attempt ${attemptId}...`, this.context);
    let status: Status = Status.SUBMIT;
    if (submitted > attempt.end) {
      status = Status.AUTOSUBMIT;
    }
    this.log(
      `Submitting question attempts of attempt ${attemptId}...`,
      this.context,
    );
    for (const qAttempt of questionAttempts) {
      await this.submitQuestionAttempt({
        questionAttemptId: qAttempt.questionAttemptId,
        selectedOptionId: qAttempt.selectedOptionId,
      });
    }
    this.log(
      `All question attempts of attempt ${attemptId} submitted`,
      this.context,
    );
    this.log(`Calculating score of attempt ${attemptId}...`, this.context);
    const score: number = attempt.questionAttempts
      .map((qAttempt) =>
        qAttempt.answerStatus === AnswerStatus.CORRECT ? 1 : 0,
      )
      .reduce((acc, curr) => acc + curr, 0);
    this.log(
      `Max score of test ${attempt.test.testId} is ${attempt.test.maxScore}`,
      this.context,
    );
    this.log(
      `Score of attempt ${attemptId} for test ${attempt.test.testId} is ${score}`,
      this.context,
    );
    this.log(`Updating attempt ${attemptId} in DB...`, this.context);
    await this.update(attemptId, {
      submitted: submitted,
      status: status,
      score: score,
    });
    this.log(`Attempt ${attemptId} updated`, this.context);
    this.log(`Query to update attempt ${attemptId} completed`, this.context);
  }

  async submitQuestionAttempt(
    submitQuestionAttemptDetails: SubmitQuestionAttemptDto,
  ) {
    const { questionAttemptId, selectedOptionId } =
      submitQuestionAttemptDetails;
    this.log(
      `Submitting question attempt ${questionAttemptId}...`,
      this.context,
    );
    this.log(
      `Checking for question attempt ${questionAttemptId} in DB...`,
      this.context,
    );
    const questionAttempt: QuestionAttempt =
      await this.questionAttemptRepository.findOne({
        where: { questionAttemptId: questionAttemptId },
      });
    if (!questionAttempt) {
      this.error(
        `Question attempt ${questionAttemptId} not found`,
        this.context,
        this.getTrace(),
      );
      throw new QuestionAttemptNotFoundException();
    }
    this.log(`Question attempt ${questionAttemptId} found`, this.context);

    this.log(
      `Checking if option ${selectedOptionId} belongs to question ${questionAttempt.question.questionId}...`,
      this.context,
    );
    const selectedOption: Option[] = questionAttempt.question.options.filter(
      (option) => option.optionId === selectedOptionId,
    );
    if (selectedOption.length === 0) {
      this.error(
        `Option ${selectedOptionId} does not belong to question ${questionAttempt.question.questionId}`,
        this.context,
        this.getTrace(),
      );
      throw new OptionNotInQuestionException();
    }
    this.log(
      `Option ${selectedOptionId} belongs to question ${questionAttempt.question.questionId}`,
      this.context,
    );

    this.log(
      `Updating answer status and selected option of question attempt ${questionAttempt.question.questionId}`,
      this.context,
    );
    const option: Option = selectedOption[0];
    if (option.isCorrect) {
      await this.questionAttemptRepository.update(questionAttemptId, {
        answerStatus: AnswerStatus.CORRECT,
        selectedOptionId: selectedOptionId,
      });
    } else {
      await this.questionAttemptRepository.update(questionAttemptId, {
        answerStatus: AnswerStatus.INCORRECT,
        selectedOptionId: selectedOptionId,
      });
    }
    this.log(
      `Answer status and selected option of question attempt ${questionAttempt.question.questionId} updated`,
      this.context,
    );
    this.log(`Question attempt ${questionAttemptId} submitted`, this.context);
  }

  async deleteAttempt(attemptIdObject: AttemptIdDto) {
    const { attemptId } = attemptIdObject;
    this.log(`Query to delete attempt ${attemptId}`, this.context);
    await this.checkIfAttemptInRepo(attemptId);
    this.log(`Deleting attempt from DB...`, this.context);
    await this.delete(attemptId);
    this.log(`Query to delete attempt ${attemptId} completed`, this.context);
  }

  async checkIfAttemptInRepo(id: number): Promise<Attempt> {
    this.log(`Checking for attempt ${id} in DB...`, this.context);
    const attempt: Attempt = await this.findOne({ where: { attemptId: id } });
    if (!attempt) {
      this.error(`Attempt ${id} not found`, this.context, this.getTrace());
      throw new AttemptNotFoundException();
    }
    this.log(`Attempt ${id} found`, this.context);
    return attempt;
  }
}
