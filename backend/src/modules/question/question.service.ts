import { InjectRepository } from '@nestjs/typeorm';
import { Test, TestIdDto } from '../test/test.entity';
import { Repository } from 'typeorm';
import {
  NewQuestionDto,
  Question,
  QuestionIdDto,
  QuestionInfoDto,
  UpdateQuestionDto,
} from './question.entity';
import {
  NewOptionDto,
  Option,
  OptionIdDto,
  OptionResponseDto,
  UpdateOptionDto,
} from './option.entity';
import BaseService from 'src/base/base.service';
import { LoggerService } from '../logger/logger.service';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import {
  TestHasMaxQuestionsException,
  TestNotFoundException,
} from '../test/test.exception';
import {
  OptionNotFoundException,
  QuestionNotFoundException,
} from './question.exception';
import { Injectable } from '@nestjs/common';
import { DatabaseException } from 'src/base/base.exception';

@Injectable()
export class QuestionService extends BaseService<Question> {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,

    loggerService: LoggerService,
  ) {
    super(questionRepository, loggerService);
    this.context = StackTrace.getSync().map((frame) =>
      path.basename(frame.fileName),
    )[0];
  }

  public async createNewQuestion(
    newQuestionDetails: NewQuestionDto,
  ): Promise<QuestionIdDto> {
    const { testId, questionText } = newQuestionDetails;
    this.log(`Query to create new question for test ${testId}`, this.context);
    const test: Test = await this.ifTestInRepo(testId);
    this.log(
      `Checking max number of questions in test ${testId}`,
      this.context,
    );
    if (test.questions.length >= test.maxScore) {
      this.error(
        `Test ${testId} already has the maximum number of questions`,
        this.context,
        this.getTrace(),
      );
      throw new TestHasMaxQuestionsException();
    }
    this.log(`New question can be created under test ${testId}`, this.context);
    this.log(`Creating question...`, this.context);
    const newQuestion = {
      questionText: questionText,
      test: test,
      options: [],
    };
    const question: Question = await this.save(newQuestion);
    this.log(`Question created and inserted into DB`, this.context);
    this.log(
      `Query to create new question for test ${testId} completed`,
      this.context,
    );
    return { questionId: question.questionId };
  }

  public async createNewOptions(
    newOptionDetails: NewOptionDto,
  ): Promise<OptionIdDto[]> {
    const { questionId, optionInfos } = newOptionDetails;
    this.log(
      `Query to create new options for question ${questionId}`,
      this.context,
    );
    const question: Question = await this.ifQuestionInRepo(questionId);
    this.log(`Question ${JSON.stringify(question)} found`, this.context);
    const options: OptionIdDto[] = [];
    for (const optionInfo of optionInfos) {
      const { isCorrect, optionText } = optionInfo;
      const optionId: OptionIdDto = await this.createOneOption(
        isCorrect,
        optionText,
        question,
      );
      options.push(optionId);
    }
    this.log(
      `Query to create new options for question ${question.questionId} completed`,
      this.context,
    );
    return options;
  }

  private async createOneOption(
    isCorrect: boolean,
    optionText: string,
    question: Question,
  ) {
    this.log(`Creating option...`, this.context);
    const newOption = {
      optionText: optionText,
      isCorrect: isCorrect,
      question: question,
    };
    let id: number;
    try {
      const option: Option = await this.optionRepository.save(newOption);
      id = option.optionId;
    } catch (error) {
      this.error(`${error.toString()}`, this.context, this.getTrace());
      throw new DatabaseException();
    }
    this.log(`Option created and inserted into DB`, this.context);
    return { optionId: id };
  }

  public async getQuestion(
    questionIdObject: QuestionIdDto,
  ): Promise<QuestionInfoDto> {
    const { questionId } = questionIdObject;
    this.log(`Query to get question ${questionId}`, this.context);
    const question: Question = await this.ifQuestionInRepo(questionId);
    this.log(`Formatting question...`, this.context);
    const optionArr: OptionResponseDto[] = question.options.map((option) => {
      return {
        optionId: option.optionId,
        optionText: option.optionText,
      };
    });
    const questionInfo: QuestionInfoDto = {
      questionId: question.questionId,
      questionText: question.questionText,
      options: optionArr,
    };
    this.log(`Question ${questionId} formatted`, this.context);
    this.log(`Query to get question ${questionId} completed`, this.context);
    return questionInfo;
  }

  public async getAllQuestions(
    testIdObject: TestIdDto,
  ): Promise<QuestionInfoDto[]> {
    const { testId } = testIdObject;
    this.log(`Query to get all questions for test ${testId}`, this.context);
    const test: Test = await this.ifTestInRepo(testId);
    this.log(`Formatting questions ...`, this.context);
    const allQuestions: QuestionInfoDto[] = test.questions.map((question) => {
      const optionArr: OptionResponseDto[] = question.options.map((option) => {
        return {
          optionId: option.optionId,
          optionText: option.optionText,
        };
      });
      return {
        questionId: question.questionId,
        questionText: question.questionText,
        options: optionArr,
      };
    });
    this.log(`All questions for test ${testId} formatted`, this.context);
    this.log(
      `Query to get all questions for test ${testId} completed`,
      this.context,
    );
    return allQuestions;
  }

  public async updateQuestion(
    updateQuestionDetails: UpdateQuestionDto,
  ): Promise<void> {
    const { questionId, questionText } = updateQuestionDetails;
    await this.ifQuestionInRepo(questionId);
    this.log(`Query to update question ${questionId}`, this.context);
    this.log(`Updating question in DB...`, this.context);
    await this.update(questionId, { questionText: questionText });
    this.log(`Question ${questionId} has been updated`, this.context);
    this.log(`Query to update question ${questionId} completed`, this.context);
  }

  public async updateOption(updateOptionDetails: UpdateOptionDto) {
    const { optionId, optionText } = updateOptionDetails;
    this.log(`Query to update option ${optionId}`, this.context);
    await this.ifOptionInRepo(optionId);
    this.log(`Updating option in DB...`, this.context);
    try {
      await this.optionRepository.update(optionId, { optionText: optionText });
    } catch (error) {
      this.error(`${error.toString()}`, this.context, this.getTrace());
      throw new DatabaseException();
    }
    this.log(`Option ${optionId} has been updated`, this.context);
    this.log(`Query to update option ${optionId} completed`, this.context);
  }

  public async deleteQuestion(questionIdObject: QuestionIdDto) {
    const { questionId } = questionIdObject;
    this.log(`Query to update question ${questionId}`, this.context);
    await this.ifQuestionInRepo(questionId);
    this.log(`Deleting question ${questionId} in DB...`, this.context);
    await this.delete(questionId);
    this.log(`Question ${questionId} has been updated`, this.context);
    this.log(`Query to update question ${questionId} completed`, this.context);
  }

  public async deleteOption(optionIdObject: OptionIdDto) {
    const { optionId } = optionIdObject;
    this.log(`Query to delete option ${optionId}`, this.context);
    await this.ifOptionInRepo(optionId);
    this.log(`Deleting option in DB...`, this.context);
    try {
      await this.optionRepository.delete(optionId);
    } catch (error) {
      this.error(`${error.toString()}`, this.context, this.getTrace());
      throw new DatabaseException();
    }
    this.log(`Option ${optionId} has been deleted from DB`, this.context);
    this.log(`Query to delete option ${optionId} completed`, this.context);
  }

  private async ifQuestionInRepo(id: number): Promise<Question> {
    this.log(`Checking DB for question ${id}...`, this.context);
    const question: Question = await this.findOne({
      relations: ['options'],
      where: { questionId: id },
    });
    if (!question) {
      this.error(`Question ${id} not found`, this.context, this.getTrace());
      throw new QuestionNotFoundException();
    }
    this.log(`Question ${id} found`, this.context);
    return question;
  }

  private async ifOptionInRepo(id: number): Promise<Option> {
    this.log(`Checking DB for option ${id}...`, this.context);
    let option: Option;
    try {
      option = await this.optionRepository.findOne({
        where: { optionId: id },
      });
    } catch (error) {
      this.error(`${error.toString()}`, this.context, this.getTrace());
      throw new DatabaseException();
    }
    if (!option) {
      this.error(`Option ${id} not found`, this.context, this.getTrace());
      throw new OptionNotFoundException();
    }
    this.log(`Option ${id} found`, this.context);
    return option;
  }

  private async ifTestInRepo(id: number): Promise<Test> {
    this.log(`Checking DB for test ${id}...`, this.context);
    let test: Test;
    try {
      test = await this.testRepository.findOne({
        relations: ['questions', 'questions.options'],
        where: { testId: id },
      });
    } catch (error) {
      this.error(`${error.toString()}`, this.context, this.getTrace());
      throw new DatabaseException();
    }
    if (!test) {
      this.error(`Test ${id} not found`, this.context, this.getTrace());
      throw new TestNotFoundException();
    }
    this.log(`Test ${id} found`, this.context);
    return test;
  }
}
