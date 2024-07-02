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
import { ResponseHandler } from 'src/base/base.response';
import { Response } from 'express';
import { TestService } from './test.service';
import {
  NewTestDto,
  Test,
  TestIdDto,
  TestInfoDto,
  UpdateTestDto,
} from './test.entity';
import { TeacherGuard } from '../user/teacher.guard';
import { CourseUserGuard } from '../course/course.user.guard';

@Controller()
export class TestController {
  constructor(private readonly testService: TestService) {}

  @UseGuards(CourseUserGuard)
  @Get('course/:courseId/tests')
  async viewAllTests(
    @Param('courseId') courseId: number,
    @Res() response: Response,
  ) {
    const tests: Partial<Test>[] = await this.testService.viewAllTests({
      courseId: courseId,
    });
    response.status(200).json(ResponseHandler.success(tests));
  }

  @UseGuards(CourseUserGuard)
  @Get('test/:testId')
  async viewTestInformation(
    @Param('testId') testId: number,
    @Res() response: Response,
  ) {
    const test: Partial<Test> = await this.testService.viewTestInfo({
      testId: testId,
    });
    response.status(200).json(ResponseHandler.success(test));
  }

  @UseGuards(CourseUserGuard)
  @Get('test/:testId/attempt')
  async getTestInfoForAttempt(
    @Param('testId') testId: number,
    @Res() response: Response,
  ) {
    const testInfo = await this.testService.getTestInfoForAttempt({
      testId: testId,
    });
    response.status(200).json(ResponseHandler.success(testInfo));
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
