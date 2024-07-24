import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AttemptService } from './attempt.service';
import { Response } from 'express';
import { ResponseHandler } from 'src/base/base.response';
import { AttemptIdDto, AttemptInfoDto } from './attempt.entity';
import { QuestionAttemptInfoDto } from './question.attempt.entity';
import { CourseUserGuard } from '../course/course.user.guard';
import { AttemptUserGuard } from './attempt.user.guard';
import { AttemptTeacherGuard } from './attempt.teacher.guard';

@Controller()
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @UseGuards(CourseUserGuard)
  @Post('attempt')
  async createNewAttempt(
    @Body('testId') testId: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { userId } = request['user'];
    const attemptIdObject: AttemptIdDto =
      await this.attemptService.createNewAttempt({
        testId: testId,
        userId: userId,
      });
    response.status(201).json(ResponseHandler.success(attemptIdObject));
  }

  // get all attempts for one user for one test (and all related question attempts)
  @UseGuards(CourseUserGuard)
  @Get('test/:testId/attempts')
  async getAllAttemptsOfUserForTest(
    @Param('testId') testId: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { userId } = request['user'];
    const attempts: AttemptInfoDto[] = await this.attemptService.getAllAttempts(
      {
        userId: userId,
        testId: testId,
      },
    );
    response.status(200).json(ResponseHandler.success(attempts));
  }

  // get single attempt (with all related question attempts)
  @UseGuards(AttemptTeacherGuard)
  @Get('attempt/:attemptId')
  async getAttempt(
    @Param('attemptId') attemptId: number,
    @Res() response: Response,
  ) {
    const attempt: AttemptInfoDto = await this.attemptService.getAttempt({
      attemptId: attemptId,
    });
    response.status(200).json(ResponseHandler.success(attempt));
  }

  @UseGuards(AttemptTeacherGuard)
  @Get('attempt/:attemptId/answers')
  async getQuestionAttempts(
    @Param('attemptId') attemptId: number,
    @Res() response: Response,
  ) {
    const questionAttempts = await this.attemptService.getQuestionAttempts({
      attemptId: attemptId,
    });
    response.status(200).json(ResponseHandler.success(questionAttempts));
  }

  @UseGuards(AttemptUserGuard)
  @Put('attempt/:attemptId')
  async submitAttempt(
    @Param('attemptId') attemptId: number,
    @Res() response: Response,
  ) {
    await this.attemptService.submitAttempt({ attemptId: attemptId });
    response.status(200).json(ResponseHandler.success());
  }

  @UseGuards(AttemptUserGuard)
  @Put('attempt/:attemptId/question')
  async saveQuestionAttempt(
    @Body() selectOptionDetails: QuestionAttemptInfoDto,
    @Param('attemptId') attemptId: number,
    @Res() response: Response,
  ) {
    await this.attemptService.saveQuestionAttempt({
      attemptId: attemptId,
      ...selectOptionDetails,
    });
    response.status(200).json(ResponseHandler.success());
  }

  @UseGuards(AttemptTeacherGuard)
  @Delete('attempt/:attemptId')
  async deleteAttempt(
    @Param('attemptId') attemptId: number,
    @Res() response: Response,
  ) {
    await this.attemptService.deleteAttempt({ attemptId: attemptId });
    response.status(200).json(ResponseHandler.success());
  }
}
