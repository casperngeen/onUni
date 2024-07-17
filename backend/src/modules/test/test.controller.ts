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
import { ResponseHandler } from 'src/base/base.response';
import { Request, Response } from 'express';
import { TestService } from './test.service';
import {
  NewTestDto,
  TestIdDto,
  TestInfoDto,
  UpdateTestDto,
} from './test.entity';
import { TeacherGuard } from '../user/teacher.guard';
import { CourseUserGuard } from '../course/course.user.guard';
import { PayloadDto } from '../user/user.entity';

@Controller()
export class TestController {
  constructor(private readonly testService: TestService) {}

  @UseGuards(CourseUserGuard)
  @Get('course/:courseId/tests')
  async viewAllTests(
    @Param('courseId') courseId: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { userId } = request['user'] as PayloadDto;
    const tests = await this.testService.viewAllTests({
      courseId: courseId,
      userId: userId,
    });
    response.status(200).json(ResponseHandler.success(tests));
  }

  @UseGuards(CourseUserGuard)
  @Get('test/:testId')
  async viewTestInformation(
    @Param('testId') testId: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { userId } = request['user'] as PayloadDto;
    const test = await this.testService.viewTestInfoForUser({
      testId: testId,
      userId: userId,
    });
    response.status(200).json(ResponseHandler.success(test));
  }

  @UseGuards(TeacherGuard)
  @Post('test')
  async createNewTest(
    @Body() testDetails: NewTestDto,
    @Res() response: Response,
  ) {
    const testId: TestIdDto = await this.testService.createNewTest(testDetails);
    response.status(200).json(ResponseHandler.success(testId));
  }

  @UseGuards(TeacherGuard)
  @Put('test/:testId')
  async updateTestInfo(
    @Param('testId') testId: number,
    @Body() testDetails: TestInfoDto,
    @Res() response: Response,
  ) {
    const updateTestDetails: UpdateTestDto = {
      testId: testId,
      ...testDetails,
    };
    await this.testService.updateTestInfo(updateTestDetails);
    response.status(200).json(ResponseHandler.success());
  }

  @UseGuards(TeacherGuard)
  @Delete('test/:testId')
  async deleteTest(@Param('testId') id: number, @Res() response: Response) {
    await this.testService.deleteTest({ testId: id });
    response.status(200).json(ResponseHandler.success());
  }
}
