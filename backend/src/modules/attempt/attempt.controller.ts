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
} from '@nestjs/common';
import { AttemptService } from './attempt.service';
import { Response } from 'express';
import { ResponseHandler } from 'src/base/base.response';
import {
  AttemptInfoDto,
  NewAttemptDto,
  SubmitAttemptDto,
  SubmitAttemptInfoDto,
} from './attempt.entity';

@Controller('attempt')
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  // create new attempt (and initalise all question attempts)
  @Post()
  async createNewAttempt(
    @Body('attempt') details: NewAttemptDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { userId } = request['user'];
    await this.attemptService.createNewAttempt({ ...details, userId: userId });
    response.status(201).json(ResponseHandler.success());
  }

  // get all attempts for one user for one test (and all related question attempts)
  @Get('all/:testId')
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
  @Get('/:attemptId')
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
  @Put('/:attemptId')
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

  // delete an attempt
  @Delete('/:attemptId')
  async deleteAttempt(
    @Param('attemptId') attemptId: number,
    @Res() response: Response,
  ) {
    await this.attemptService.deleteAttempt({ attemptId: attemptId });
    response.status(200).json(ResponseHandler.success());
  }
}
