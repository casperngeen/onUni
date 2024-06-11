import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { QuestionService } from './question.service';
import { NewQuestionDto, QuestionInfoDto } from './question.entity';
import { ResponseHandler } from 'src/base/base.response';
import { NewOptionDto } from './option.entity';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('test/:testid')
  async createNewQuestion(
    @Param('testid') testId: number,
    @Body('questionText') questionText: string,
    @Res() response: Response,
  ) {
    const newQuestionDetails: NewQuestionDto = {
      testId: testId,
      questionText: questionText,
    };
    await this.questionService.createNewQuestion(newQuestionDetails);
    response.status(201).json(ResponseHandler.success());
  }

  @Post('/:questionId')
  async createNewOption(
    @Param('questionId') questionId: number,
    @Body('optionText') optionText: string,
    @Res() response: Response,
  ) {
    const newOptionDetails: NewOptionDto = {
      questionId: questionId,
      optionText: optionText,
    };
    await this.questionService.createNewOption(newOptionDetails);
    response.status(201).json(ResponseHandler.success());
  }

  @Get('/:questionId')
  async getQuestion(
    @Param('questionId') questionId: number,
    @Res() response: Response,
  ) {
    const question: QuestionInfoDto = await this.questionService.getQuestion({
      questionId: questionId,
    });
    response.status(200).json(ResponseHandler.success(question));
  }

  @Get('test/:testId')
  async getAllQuestions(
    @Param('testId') testId: number,
    @Res() response: Response,
  ) {
    const allQuestions: QuestionInfoDto[] =
      await this.questionService.getAllQuestions({
        testId: testId,
      });
    response.status(200).json(ResponseHandler.success(allQuestions));
  }

  // update question
  @Put('/:questionId')
  async updateQuestion(
    @Param('questionId') questionId: number,
    @Body('questionText') questionText: string,
    @Res() response: Response,
  ) {
    const updateQuestionDetails = {
      questionId: questionId,
      questionText: questionText,
    };
    await this.questionService.updateQuestion(updateQuestionDetails);
    response.status(200).json(ResponseHandler.success());
  }

  // update option
  @Put('option/:optionId')
  async updateOption(
    @Param('optionId') optionId: number,
    @Body('optionText') optionText: string,
    @Res() response: Response,
  ) {
    const updateOptionDetails = {
      optionId: optionId,
      optionText: optionText,
    };
    await this.questionService.updateOption(updateOptionDetails);
    response.status(200).json(ResponseHandler.success());
  }

  // delete question
  @Delete('/:questionId')
  async deleteQuestion(
    @Param('questionId') questionId: number,
    @Res() response: Response,
  ) {
    await this.questionService.deleteQuestion({ questionId: questionId });
    response.status(200).json(ResponseHandler.success());
  }

  // delete option
  @Delete('option/:optionId')
  async deleteOption(
    @Param('optionId') optionId: number,
    @Res() response: Response,
  ) {
    await this.questionService.deleteOption({ optionId: optionId });
    response.status(200).json(ResponseHandler.success());
  }
}
