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
import {
  AttemptIdDto,
  AttemptInfoDto,
  SubmitAttemptDto,
  SubmitAttemptInfoDto,
} from './attempt.entity';
import { SelectOptionDto } from './question.attempt.entity';
import { CourseUserGuard } from '../course/course.user.guard';
import { TeacherGuard } from '../course/teacher.guard';
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
    const attemptId: AttemptIdDto = await this.attemptService.createNewAttempt({
      testId: testId,
      userId: userId,
    });
    response.status(201).json(ResponseHandler.success(attemptId));
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

  // update attempt information (changing status of submission)
  @UseGuards(AttemptUserGuard)
  @Put('attempt/:attemptId')
  async submitAttempt(
    @Param('attemptId') attemptId: number,
    // only include questions that have a selected answer (exclude all unselected options)
    @Req() request: Request,
    @Body('attempt') details: SubmitAttemptInfoDto,
    @Res() response: Response,
  ) {
    const { userId } = request['user'];
    const submitAttempt: SubmitAttemptDto = {
      userId: userId,
      attemptId: attemptId,
      ...details,
    };
    await this.attemptService.submitAttempt(submitAttempt);
    response.status(200).json(ResponseHandler.success());
  }

  @UseGuards(AttemptUserGuard)
  @Put('attempt/:attemptId')
  async saveQuestionAttempt(
    @Body() selectOptionDetails: SelectOptionDto,
    @Param('attemptId') attemptId: number,
    @Res() response: Response,
  ) {
    await this.attemptService.saveQuestionAttempt({
      attemptId: attemptId,
      ...selectOptionDetails,
    });
    response.status(200).json(ResponseHandler.success());
  }

  @UseGuards(TeacherGuard)
  @Delete('/:attemptId')
  async deleteAttempt(
    @Param('attemptId') attemptId: number,
    @Res() response: Response,
  ) {
    await this.attemptService.deleteAttempt({ attemptId: attemptId });
    response.status(200).json(ResponseHandler.success());
  }
}
