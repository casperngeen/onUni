import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
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
import { TeacherGuard } from '../course/teacher.guard';
import { CourseUserGuard } from '../course/course.user.guard';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(TeacherGuard)
  @Post('question')
  async createNewQuestion(
    @Body() questionInfo: NewQuestionDto,
    @Res() response: Response,
  ) {
    const questionId: QuestionIdDto =
      await this.questionService.createNewQuestion(questionInfo);
    response.status(201).json(ResponseHandler.success(questionId));
  }

  @UseGuards(TeacherGuard)
  @Post('question/:questionId')
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

  @UseGuards(CourseUserGuard)
  @Get('test/:testId/questions')
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

  @UseGuards(CourseUserGuard)
  @Get('question/:questionId')
  async getQuestion(
    @Param('questionId') questionId: number,
    @Res() response: Response,
  ) {
    const question: QuestionInfoDto = await this.questionService.getQuestion({
      questionId: questionId,
    });
    response.status(200).json(ResponseHandler.success(question));
  }

  @UseGuards(TeacherGuard)
  @Put('question/:questionId')
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

  @UseGuards(TeacherGuard)
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

  @UseGuards(TeacherGuard)
  @Delete('question/:questionId')
  async deleteQuestion(
    @Param('questionId') questionId: number,
    @Res() response: Response,
  ) {
    await this.questionService.deleteQuestion({ questionId: questionId });
    response.status(200).json(ResponseHandler.success());
  }

  @UseGuards(TeacherGuard)
  @Delete('option/:optionId')
  async deleteOption(
    @Param('optionId') optionId: number,
    @Res() response: Response,
  ) {
    await this.questionService.deleteOption({ optionId: optionId });
    response.status(200).json(ResponseHandler.success());
  }
}
