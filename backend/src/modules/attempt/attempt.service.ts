import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  Attempt,
  AttemptIdDto,
  AttemptInfoDto,
  SubmitAttemptDto,
  UserTestDto,
} from './attempt.entity';
import { AnswerStatus, Status } from './attempt.enum';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QuestionAttempt,
  QuestionAttemptInfoDto,
  QuestionAttemptResponseDto,
  RedisOptionDto,
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
import { UserNotFoundException } from '../user/user.exception';
import { TestNotFoundException } from '../test/test.exception';
import { Option } from '../question/option.entity';
import { DatabaseException, RedisException } from 'src/base/base.exception';
import { QuestionNotFoundException } from '../question/question.exception';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

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

    @InjectRedis()
    private readonly redis: Redis,

    loggerService: LoggerService,
  ) {
    super(attemptRepository, loggerService);
    this.context = StackTrace.getSync().map((frame) =>
      path.basename(frame.fileName),
    )[0];
  }

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
    this.log(
      `Checking if user ${userId} has reached attempt limit for test ${testId}`,
      this.context,
    );
    const start = new Date();
    let end: string | null = null;
    if (test.timeLimit) {
      end = new Date(
        start.getTime() + test.timeLimit * 60 * 1000,
      ).toISOString();
    }
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
    const attempt: Attempt = await this.save({
      start: start.toISOString(),
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
      `Shuffling questions and options for attempt ${attempt.attemptId}`,
      this.context,
    );
    const shuffledQuestions: Question[] = this.shuffleArray(test.questions);
    for (const question of shuffledQuestions) {
      this.shuffleArray(question.options);
    }
    this.log(
      `Saving questions and options for attempt ${attempt.attemptId} to Redis...`,
      this.context,
    );
    await this.saveQuestionsToRedis(shuffledQuestions, attempt.attemptId);
    this.log(
      `Query to create new attempt for user ${userId} for test ${testId} completed`,
      this.context,
    );
    return { attemptId: attempt.attemptId };
  }

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

  public async getQuestionAttempts(attemptIdObject: AttemptIdDto) {
    const { attemptId } = attemptIdObject;
    const savedAttempts: Map<number, RedisOptionDto> = new Map();
    this.log(
      `Query to fetch existing question attempts of attempt ${attemptId}`,
      this.context,
    );
    await this.getQuestionAttemptsFromRedis(attemptId, savedAttempts);
    const questionAttempts: QuestionAttemptInfoDto[] = [];
    for (const attempt of savedAttempts) {
      questionAttempts.push({
        questionId: attempt[0],
        selectedOptionId: attempt[1].selectedOptionId,
      });
    }
    return questionAttempts;
  }

  public async submitAttempt(submitAttemptDetails: SubmitAttemptDto) {
    const { userId, attemptId } = submitAttemptDetails;
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
    this.log(
      `Updating status of attempt ${attemptId} to CALCULATING...`,
      this.context,
    );
    this.update(attemptId, { status: Status.CALCULATING });
    this.log(`Submitting attempt ${attemptId}...`, this.context);
    let status: Status = Status.SUBMIT;
    const submitTime = new Date();
    if (attempt.end && submitTime.toISOString() > attempt.end) {
      status = Status.AUTOSUBMIT;
    }
    this.log(
      `Retrieving question attempts of attempt ${attemptId} from Redis`,
      this.context,
    );
    const savedAttempts: Map<number, RedisOptionDto> = new Map();
    await this.getQuestionAttemptsFromRedis(attemptId, savedAttempts);

    this.log(
      `Submitting question attempts of attempt ${attemptId}...`,
      this.context,
    );
    let score: number = 0;
    await Promise.all(
      attempt.test.questions.map(async (question) => {
        const { questionId } = question;
        if (savedAttempts.has(question.questionId)) {
          this.log(
            `Saving answer for question ${questionId} for attempt ${attemptId}`,
            this.context,
          );
          const { selectedOptionId } = savedAttempts.get(questionId);
          const question = await this.getQuestionFromRepo(questionId);
          const option: Option = await this.ifOptionBelongsToQuestion(
            question,
            selectedOptionId,
          );
          await this.questionAttemptRepository.save({
            selectedOptionId: selectedOptionId,
            answerStatus: option.isCorrect
              ? AnswerStatus.CORRECT
              : AnswerStatus.INCORRECT,
            attempt: attempt,
            question: question,
          });
          if (option.isCorrect) {
            score++;
          }
          this.log(
            `Option ${selectedOptionId} for question ${question.questionId} for attempt ${attemptId} saved`,
            this.context,
          );
        }
      }),
    );
    this.log(
      `All question attempts of attempt ${attemptId} submitted`,
      this.context,
    );
    this.log(
      `Max score of test ${attempt.test.testId} is ${attempt.test.questions.length}`,
      this.context,
    );
    this.log(
      `Score of attempt ${attemptId} for test ${attempt.test.testId} is ${score}`,
      this.context,
    );
    this.log(`Updating attempt ${attemptId} in DB...`, this.context);
    await this.update(attemptId, {
      submitted: submitTime.toISOString(),
      status: status,
      score: score,
    });
    this.log(`Attempt ${attemptId} updated`, this.context);
    await this.deleteQuestionAttemptsFromRedis(attemptId);
    await this.deleteQuestionFromRedis(attemptId);
    this.log(`Query to update attempt ${attemptId} completed`, this.context);
  }

  public async saveQuestionAttempt(
    selectOptionDetails: UpdateQuestionAttemptDto,
  ) {
    // const time = new Date().toISOString();
    // check end time in redis
    const { attemptId, selectedOptionId, questionId } = selectOptionDetails;
    const attempt = await this.checkIfAttemptInRepo(attemptId);
    if (attempt.end && new Date().toISOString() > attempt.end) {
      this.error(
        `User cannot update answer as time limit for attempt ${attemptId} has exceeded`,
        this.context,
        this.getTrace(),
      );
      throw new AttemptTimeLimitExceededException();
    }
    this.log(
      `Saving question ${questionId} of attempt ${attemptId} to Redis...`,
      this.context,
    );

    try {
      await this.redis.hset(
        `attempt:${attemptId}:question:${questionId}`,
        `selectedOptionId`,
        selectedOptionId,
      );
      this.log(
        `Saved question ${questionId} of attempt ${attemptId} to Redis`,
        this.context,
      );
    } catch (error) {
      this.error(
        `Error saving question ${questionId} of attempt ${attemptId} to Redis: ${error}`,
        this.context,
        this.getTrace(),
      );
      throw new RedisException();
    }
  }

  public async deleteAttempt(attemptIdObject: AttemptIdDto) {
    const { attemptId } = attemptIdObject;
    this.log(`Query to delete attempt ${attemptId}`, this.context);
    await this.checkIfAttemptInRepo(attemptId);
    await this.deleteQuestionAttemptsFromRedis(attemptId);
    await this.deleteQuestionFromRedis(attemptId);
    this.log(`Deleting attempt from DB...`, this.context);
    await this.delete(attemptId);
    this.log(`Query to delete attempt ${attemptId} completed`, this.context);
  }

  public async getAttemptFromRepo(id: number): Promise<Attempt> {
    this.log(`Retrieving attempt ${id} from DB...`, this.context);
    const attempt: Attempt = await this.findOne({
      relations: [
        'questionAttempts',
        'user',
        'test',
        'test.course',
        'test.course.users',
      ],
      where: { attemptId: id },
    });
    if (!attempt) {
      this.error(`Attempt ${id} not found`, this.context, this.getTrace());
      throw new AttemptNotFoundException();
    }
    this.log(`Attempt ${id} retrieved`, this.context);
    return attempt;
  }

  private async checkIfAttemptInRepo(id: number): Promise<Attempt> {
    this.log(`Checking for attempt ${id} in DB...`, this.context);
    const attempt: Attempt = await this.findOne({
      relations: [
        'questionAttempts',
        'questionAttempts.question',
        'user',
        'test',
        'test.course',
        'test.questions',
        'test.questions.options',
      ],
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
    return selectedOption[0];
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
      questions: attempt.test.questions,
      testTitle: attempt.test.title,
      courseTitle: attempt.test.course.title,
      testType: attempt.test.testType,
    };
    this.log(
      `Attempt info for attempt ${attempt.attemptId} formatted`,
      this.context,
    );
    return attemptInfo;
  }

  private async getQuestionAttemptsFromRedis(
    attemptId: number,
    result: Map<number, RedisOptionDto>,
  ) {
    try {
      await new Promise<void>((resolve, reject) => {
        const stream = this.redis.scanStream({
          match: `attempt:${attemptId}:question:*`,
          count: 100,
        });
        stream.on('data', (resultKeys: string[]) => {
          stream.pause();
          Promise.all(
            resultKeys.map(async (resultKey) => {
              const keys = resultKey.split(':');
              const questionId = parseInt(keys[3]);
              this.log(
                `Retrieving question attempt of question ${questionId} from Redis...`,
                this.context,
              );
              const value = await this.redis.hgetall(resultKey);
              this.log(
                `Question attempt of question ${questionId} retrieved from Redis`,
                this.context,
              );
              this.log(
                `Formatting and hashing question attempt of question ${questionId}...`,
                this.context,
              );
              const { selectedOptionId } = value;
              const optionId: number = parseInt(selectedOptionId);
              result.set(questionId, {
                selectedOptionId: optionId,
              });
              this.log(
                `Formatted and hashed question attempt of question ${questionId}`,
                this.context,
              );
            }),
          ).then(() => {
            stream.resume();
          });
        });

        stream.on('end', () => {
          this.log(
            `All question attempts of attempt ${attemptId} retrieved from Redis`,
            this.context,
          );
          resolve();
        });

        stream.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      this.error(`${error}`, this.context, this.getTrace());
      throw new RedisException();
    }
  }

  private async deleteQuestionAttemptsFromRedis(attemptId: number) {
    await new Promise<void>((resolve, reject) => {
      const stream = this.redis.scanStream({
        match: `attempt:${attemptId}:question:*`,
        count: 100,
      });

      stream.on('data', (keys: string[]) => {
        stream.pause();

        Promise.all(
          keys.map(async (key) => {
            try {
              await this.redis.del(key); // Delete the key
              this.log(`Deleted key: '${key}' from Redis`, this.context);
            } catch (error) {
              this.error(
                `Error deleting key: ${key} from Redis`,
                this.context,
                this.getTrace(),
              );
              throw new RedisException();
            }
          }),
        ).then(() => {
          stream.resume();
        });

        stream.on('end', () => {
          this.log(
            `All question attempts of attempt ${attemptId} has been deleted from Redis`,
            this.context,
          );
          resolve();
        });

        stream.on('error', (error) => {
          reject(error);
        });
      });
    });
  }

  /**
   * An in-place shuffling of any array (using Durstenfeld shuffle, an optimized version of Knuth shuffle)
   * @param array The array to be shuffled
   */
  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private async saveQuestionsToRedis(questions: Question[], attemptId: number) {
    try {
      await this.redis.hset(
        `shuffled-attempt:${attemptId}`,
        `questions`,
        JSON.stringify(questions),
      );
      this.log(
        `Saved shuffled questions and options of attempt ${attemptId} to Redis`,
        this.context,
      );
    } catch (error) {
      this.error(
        `Error saving shuffled questions and options of attempt ${attemptId} to Redis: ${error}`,
        this.context,
        this.getTrace(),
      );
      throw new RedisException();
    }
  }

  private async deleteQuestionFromRedis(attemptId: number) {
    try {
      await this.redis.hdel(`shuffled-attempt:${attemptId}`, `questions`);
      this.log(
        `Deleted shuffled questions and options of attempt ${attemptId} from Redis`,
        this.context,
      );
    } catch (error) {
      this.error(
        `Error retrieving shuffled questions and options of attempt ${attemptId}: ${error}`,
        this.context,
        this.getTrace(),
      );
      throw new RedisException();
    }
  }
}
