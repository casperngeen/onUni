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
import {
  NewQuestionDto,
  QuestionIdDto,
  QuestionInfoDto,
} from './question.entity';
import { ResponseHandler } from 'src/base/base.response';
import {
  NewOptionDto,
  OptionIdDto,
  OptionInfoDto,
  UpdateOptionDto,
} from './option.entity';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async createNewQuestion(
    @Body('questionInfo') questionInfo: NewQuestionDto,
    @Res() response: Response,
  ) {
    const questionId: QuestionIdDto =
      await this.questionService.createNewQuestion(questionInfo);
    response.status(201).json(ResponseHandler.success(questionId));
  }

  @Post('/:questionId')
  async createNewOptions(
    @Param('questionId') questionId: number,
    @Body('optionInfo') optionInfos: OptionInfoDto[],
    @Res() response: Response,
  ) {
    const newOptionDetails: NewOptionDto = {
      questionId: questionId,
      optionInfos: optionInfos,
    };
    const optionIds: OptionIdDto[] =
      await this.questionService.createNewOptions(newOptionDetails);
    response.status(201).json(ResponseHandler.success(optionIds));
  }

  @Get()
  async getAllQuestions(
    @Body('testId') testId: number,
    @Res() response: Response,
  ) {
    const allQuestions: QuestionInfoDto[] =
      await this.questionService.getAllQuestions({
        testId: testId,
      });
    response.status(200).json(ResponseHandler.success(allQuestions));
  }

  // get question with all related options
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
    @Body('optionInfo') optionInfo: OptionInfoDto,
    @Res() response: Response,
  ) {
    const updateOptionDetails: UpdateOptionDto = {
      optionId: optionId,
      ...optionInfo,
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
