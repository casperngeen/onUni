import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  Attempt,
  AttemptIdDto,
  AttemptInfoDto,
  AttemptResponseDto,
  Status,
  SubmitAttemptDto,
  UserTestDto,
} from './attempt.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AnswerStatus,
  QuestionAttempt,
  QuestionAttemptResponseDto,
  UpdateQuestionAttemptDto,
} from './question.attempt.entity';
import { Test } from '../test/test.entity';
import { User } from '../user/user.entity';
import { LoggerService } from '../logger/logger.service';
import BaseService from 'src/base/base.service';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import { Question } from '../question/question.entity';
import {
  AttemptAlreadySubmittedException,
  AttemptNotFoundException,
  AttemptTimeLimitExceededException,
  CalculatingScoreOfAttemptException,
  OptionNotInQuestionException,
  ReachedAttemptLimitException,
  TestNotAttemptedException,
} from './attempt.exception';
import {
  UnauthorisedUserException,
  UserNotFoundException,
} from '../user/user.exception';
import { TestNotFoundException } from '../test/test.exception';
import { Option } from '../question/option.entity';
import { DatabaseException } from 'src/base/base.exception';
import { QuestionNotFoundException } from '../question/question.exception';
import { UserNotInCourseException } from '../course/course.exception';

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

  // for anyone that takes the course
  public async createNewAttempt(newAttemptDetails: UserTestDto) {
    const { testId, userId } = newAttemptDetails;
    this.log(
      `Query to create new attempt for user ${userId} for test ${testId}`,
      this.context,
    );
    this.log(`Checking for test ${testId} in DB...`, this.context);
    const test: Test = await this.testRepository.findOne({
      relations: ['questions', 'questions.options', 'course', 'course.users'],
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
    const user: User = await this.getUserFromRepo(userId);
    await this.isUserAllowedToTakeTest(user, test);
    this.log(
      `Checking if user ${userId} has reached attempt limit for test ${testId}`,
      this.context,
    );
    if (test.maxAttempt) {
      // check this again
      const numOfAttempts: number = await this.attemptRepository
        .createQueryBuilder('attempt')
        .where('userId = :userId', {
          userId: userId,
        })
        .where('testId = :testId', {
          testId: testId,
        })
        .getCount();
      if (numOfAttempts >= test.maxAttempt) {
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
    const start = new Date();
    let end = null;
    if (test.timeLimit) {
      end = new Date(start.getTime() + test.timeLimit * 60 * 1000);
    }
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
      `Formatting questions and options for test ${testId}...`,
      this.context,
    );
    const response = this.formatAttemptResponse(test, attempt.attemptId);
    this.log(
      `Questions and options for test ${testId} have been formatted`,
      this.context,
    );
    this.log(
      `Query to create new attempt for user ${userId} for test ${testId} completed`,
      this.context,
    );
    return response;
  }

  // for teachers + the student who is associated with the attempt
  public async getAllAttempts(
    userTestDetails: UserTestDto,
  ): Promise<AttemptInfoDto[]> {
    const { userId, testId } = userTestDetails;
    this.log(
      `Query to get all attempts of test ${testId} for user ${userId}`,
      this.context,
    );
    const user: User = await this.getUserFromRepo(userId);

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
    const attemptsInfo: AttemptInfoDto[] = attempts.map((attempt) =>
      this.formatAttemptInfo(attempt),
    );
    this.log(`Attempts of test ${testId} formatted`, this.context);
    this.log(
      `Query to get all attempts of test ${testId} for user ${userId} completed`,
      this.context,
    );
    return attemptsInfo;
  }

  // same as above
  public async getAttempt(
    attemptIdObject: AttemptIdDto,
  ): Promise<AttemptInfoDto> {
    const { attemptId } = attemptIdObject;
    this.log(`Query to get attempt ${attemptId}`, this.context);
    const attempt: Attempt = await this.checkIfAttemptInRepo(attemptId);
    const attemptInfo: AttemptInfoDto = this.formatAttemptInfo(attempt);
    this.log(`Query to get attempt ${attemptId} completed`, this.context);
    return attemptInfo;
  }

  public async submitAttempt(submitAttemptDetails: SubmitAttemptDto) {
    const { userId, attemptId, questionAttempts } = submitAttemptDetails;
    this.log(`Query to submit attempt ${attemptId}`, this.context);
    const attempt: Attempt = await this.checkIfAttemptInRepo(attemptId);
    if (attempt.status === Status.SUBMIT) {
      this.error(
        `User ${userId} has already submitted attempt ${attemptId}`,
        this.context,
        this.getTrace(),
      );
      throw new AttemptAlreadySubmittedException();
    }
    if (attempt.status === Status.CALCULATING) {
      this.error(
        `Currently calculating score of attempt ${attemptId}`,
        this.context,
        this.getTrace(),
      );
      throw new CalculatingScoreOfAttemptException();
    }
    await this.isUserAllowedToSubmit(attempt, userId);
    this.log(
      `Updating status of attempt ${attemptId} to CALCULATING...`,
      this.context,
    );
    this.update(attemptId, { status: Status.CALCULATING });
    this.log(
      `Status of attempt ${attemptId} updated to CALCULATING...`,
      this.context,
    );
    this.log(`Submitting attempt ${attemptId}...`, this.context);
    let status: Status = Status.SUBMIT;
    const submitTime = new Date();
    if (attempt.end && submitTime > attempt.end) {
      status = Status.AUTOSUBMIT;
    }
    this.log(
      `Submitting question attempts of attempt ${attemptId}...`,
      this.context,
    );
    let score: number = 0;
    for (const qAttempt of questionAttempts) {
      score += await this.saveQuestionAttempt({
        questionId: qAttempt.questionId,
        selectedOptionId: qAttempt.selectedOptionId,
        attemptId: attemptId,
        fromUser: false,
      });
    }
    this.log(
      `All question attempts of attempt ${attemptId} submitted`,
      this.context,
    );
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
      submitted: submitTime,
      status: status,
      score: score,
    });
    this.log(`Attempt ${attemptId} updated`, this.context);
    this.log(`Query to update attempt ${attemptId} completed`, this.context);
  }

  public async saveQuestionAttempt(
    selectOptionDetails: UpdateQuestionAttemptDto,
  ) {
    const { attemptId, selectedOptionId, questionId, fromUser } =
      selectOptionDetails;
    this.log(
      `Query to save question attempt of question ${questionId} for attempt ${attemptId} completed`,
      this.context,
    );
    const attempt: Attempt = await this.checkIfAttemptInRepo(attemptId);
    if (fromUser && attempt.end && new Date() > attempt.end) {
      this.error(
        `User cannot update answer as time limit for attempt ${attemptId} has exceeded`,
        this.context,
        this.getTrace(),
      );
      throw new AttemptTimeLimitExceededException();
    }
    const question: Question = await this.getQuestionFromRepo(questionId);
    const option: Option = await this.ifOptionBelongsToQuestion(
      question,
      selectedOptionId,
    )[0];
    this.log(
      `Saving question ${questionId} of attempt ${attemptId} to DB...`,
      this.context,
    );
    const questionAttemptDetails = {
      answerStatus: option.isCorrect
        ? AnswerStatus.CORRECT
        : AnswerStatus.INCORRECT,
      selectedOptionId: selectedOptionId,
      question: question,
      attempt: attempt,
    };
    await this.questionAttemptRepository.save(questionAttemptDetails);
    this.log(
      `Saved question ${questionId} of attempt ${attemptId} to DB`,
      this.context,
    );
    this.log(
      `Query to save question attempt of question ${questionId} for attempt ${attemptId} completed`,
      this.context,
    );
    return option.isCorrect ? 1 : 0;
  }

  public async deleteAttempt(attemptIdObject: AttemptIdDto) {
    const { attemptId } = attemptIdObject;
    this.log(`Query to delete attempt ${attemptId}`, this.context);
    await this.checkIfAttemptInRepo(attemptId);
    this.log(`Deleting attempt from DB...`, this.context);
    await this.delete(attemptId);
    this.log(`Query to delete attempt ${attemptId} completed`, this.context);
  }

  private async checkIfAttemptInRepo(id: number): Promise<Attempt> {
    this.log(`Checking for attempt ${id} in DB...`, this.context);
    const attempt: Attempt = await this.findOne({
      relations: ['questionAttempts', 'user', 'test'],
      where: { attemptId: id },
    });
    if (!attempt) {
      this.error(`Attempt ${id} not found`, this.context, this.getTrace());
      throw new AttemptNotFoundException();
    }
    this.log(`Attempt ${id} found`, this.context);
    return attempt;
  }

  private async getQuestionFromRepo(questionId: number) {
    this.log(`Retrieving question ${questionId} from DB...`, this.context);
    let question: Question;
    try {
      question = await this.questionRepository.findOne({
        relations: ['options'],
        where: { questionId: questionId },
      });
    } catch (error) {
      this.error(`${error}`, this.context, this.getTrace());
      throw new DatabaseException();
    }
    if (!question) {
      this.error(
        `Question ${questionId} cannot be found`,
        this.context,
        this.getTrace(),
      );
      throw new QuestionNotFoundException();
    }
    this.log(`Found question ${questionId}`, this.context);
    return question;
  }

  private async ifOptionBelongsToQuestion(
    question: Question,
    optionId: number,
  ) {
    this.log(
      `Checking if option ${optionId} belongs to question ${question.questionId}...`,
      this.context,
    );
    this.log(`Checking for option ${optionId}...`, this.context);
    const selectedOption: Option[] = question.options.filter(
      (option) => option.optionId === optionId,
    );
    if (selectedOption.length === 0) {
      this.error(
        `Option ${optionId} does not belong to question ${question.questionId}`,
        this.context,
        this.getTrace(),
      );
      throw new OptionNotInQuestionException();
    }
    this.log(
      `Option ${optionId} belongs to question ${question.questionId}`,
      this.context,
    );
    return selectedOption;
  }

  private async getUserFromRepo(userId: number) {
    this.log(`Checking for user ${userId} in DB...`, this.context);
    const user: User = await this.userRepository.findOne({
      relations: ['attempts', 'attempts.test', 'attempts.questionAttempts'],
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
    return user;
  }

  private async isUserAllowedToTakeTest(user: User, test: Test) {
    const { userId } = user;
    const { testId } = test;
    this.log(
      `Checking if user ${userId} is allowed to take test ${testId}`,
      this.context,
    );
    let userInCourse: boolean = false;
    for (const user of test.course.users) {
      if (user.userId === userId) {
        userInCourse = true;
        break;
      }
    }
    if (!userInCourse) {
      this.error(
        `User ${userId} is not part of course ${test.course.courseId}`,
        this.context,
        this.getTrace(),
      );
      throw new UserNotInCourseException();
    }
    this.log(`User ${userId} is allowed to take test ${testId}`, this.context);
  }

  private formatAttemptInfo(attempt: Attempt): AttemptInfoDto {
    this.log(
      `Formatting question attempts for attempt ${attempt.attemptId}...`,
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
      `Formatting attempt info for attempt ${attempt.attemptId}...`,
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
    this.log(
      `Attempt info for attempt ${attempt.attemptId} formatted`,
      this.context,
    );
    return attemptInfo;
  }

  private formatAttemptResponse(
    test: Test,
    attemptId: number,
  ): AttemptResponseDto {
    return {
      attemptId: attemptId,
      questions: test.questions.map((question) => {
        return {
          questionId: question.questionId,
          questionText: question.questionText,
          options: question.options.map((option) => {
            return {
              optionId: option.optionId,
              optionText: option.optionText,
            };
          }),
        };
      }),
    };
  }

  private async isUserAllowedToSubmit(attempt: Attempt, userId: number) {
    const { attemptId } = attempt;
    this.log(
      `Checking if attempt ${attemptId} belongs to user ${userId}`,
      this.context,
    );
    if (attempt.user.userId !== userId) {
      this.error(
        `Attempt ${attemptId} does not belong to user ${userId}`,
        this.context,
        this.getTrace(),
      );
      throw new UnauthorisedUserException();
    }
    this.log(`Attempt ${attemptId} belongs to user ${userId}`, this.context);
  }
}
