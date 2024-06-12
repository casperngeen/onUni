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
import { TestNotFoundException } from '../test/test.exception';
import {
  OptionNotFoundException,
  QuestionNotFoundException,
} from './question.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionService extends BaseService<Question> {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Question)
    private readonly optionRepository: Repository<Option>,

    loggerService: LoggerService,
  ) {
    super(questionRepository, loggerService);
    this.context = StackTrace.getSync().map((frame) =>
      path.basename(frame.fileName),
    )[0];
  }

  async createNewQuestion(newQuestionDetails: NewQuestionDto): Promise<void> {
    const { testId, questionText } = newQuestionDetails;
    this.log(`Query to create new question for test ${testId}`, this.context);
    const test: Test = await this.ifTestInRepo(testId);
    this.log(`Creating question...`, this.context);
    const newQuestion = {
      questionText: questionText,
      test: test,
      options: [],
    };
    await this.insert(newQuestion);
    this.log(`Question created and inserted into DB`, this.context);
    this.log(
      `Query to create new question for test ${testId} completed`,
      this.context,
    );
  }

  async createNewOption(newOptionDetails: NewOptionDto): Promise<void> {
    const { questionId, optionText } = newOptionDetails;
    this.log(
      `Query to create new option for question ${questionId}`,
      this.context,
    );
    const question: Question = await this.ifQuestionInRepo(questionId);
    this.log(`Question ${questionId} found`, this.context);
    this.log(`Creating option...`, this.context);
    const newOption = {
      optionText: optionText,
      question: question,
    };
    await this.optionRepository.insert(newOption);
    this.log(`Option created and inserted into DB`, this.context);
    this.log(
      `Query to create new option for question ${questionId} completed`,
      this.context,
    );
  }

  async getQuestion(questionIdObject: QuestionIdDto): Promise<QuestionInfoDto> {
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
    return questionInfo;
  }

  async getAllQuestions(testIdObject: TestIdDto): Promise<QuestionInfoDto[]> {
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

    return allQuestions;
  }

  async updateQuestion(
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

  async updateOption(updateOptionDetails: UpdateOptionDto) {
    const { optionId, optionText } = updateOptionDetails;
    this.log(`Query to update option ${optionId}`, this.context);
    await this.ifOptionInRepo(optionId);
    this.log(`Updating option in DB...`, this.context);
    await this.optionRepository.update(optionId, { optionText: optionText });
    this.log(`Option ${optionId} has been updated`, this.context);
    this.log(`Query to update option ${optionId} completed`, this.context);
  }

  async deleteQuestion(questionIdObject: QuestionIdDto) {
    const { questionId } = questionIdObject;
    this.log(`Query to update question ${questionId}`, this.context);
    await this.ifQuestionInRepo(questionId);
    this.log(`Deleting question ${questionId} in DB...`, this.context);
    await this.delete(questionId);
    this.log(`Question ${questionId} has been updated`, this.context);
    this.log(`Query to update question ${questionId} completed`, this.context);
  }

  async deleteOption(optionIdObject: OptionIdDto) {
    const { optionId } = optionIdObject;
    this.log(`Query to delete option ${optionId}`, this.context);
    await this.ifOptionInRepo(optionId);
    this.log(`Deleting option in DB...`, this.context);
    await this.optionRepository.delete(optionId);
    this.log(`Option ${optionId} has been deleted from DB`, this.context);
    this.log(`Query to delete option ${optionId} completed`, this.context);
  }

  async ifQuestionInRepo(id: number): Promise<Question> {
    this.log(`Checking DB for question ${id}...`, this.context);
    const question: Question = await this.findOne({
      where: { questionId: id },
    });
    if (!question) {
      this.error(`Question ${id} not found`, this.context, this.getTrace());
      throw new QuestionNotFoundException();
    }
    this.log(`Question ${id} found`, this.context);
    return question;
  }

  async ifOptionInRepo(id: number): Promise<Option> {
    this.log(`Checking DB for option ${id}...`, this.context);
    const option: Option = await this.optionRepository.findOne({
      where: { optionId: id },
    });
    if (!option) {
      this.error(`Option ${id} not found`, this.context, this.getTrace());
      throw new OptionNotFoundException();
    }
    this.log(`Option ${id} found`, this.context);
    return option;
  }

  async ifTestInRepo(id: number): Promise<Test> {
    this.log(`Checking DB for test ${id}...`, this.context);
    const test: Test = await this.testRepository.findOne({
      where: { testId: id },
    });
    if (!test) {
      this.error(`Test ${id} not found`, this.context, this.getTrace());
      throw new TestNotFoundException();
    }
    this.log(`Test ${id} found`, this.context);
    return test;
  }
}
