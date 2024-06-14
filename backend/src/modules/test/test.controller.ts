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

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  async viewAllTests(
    @Param('courseId') courseId: number,
    @Res() response: Response,
  ) {
    const tests: Partial<Test>[] = await this.testService.viewAllTests({
      courseId: courseId,
    });
    response.status(200).json(ResponseHandler.success(tests));
  }

  @Get('/:testId')
  async viewTestInformation(
    @Param('testId') id: number,
    @Res() response: Response,
  ) {
    const test: Partial<Test> = await this.testService.viewTestInfo({
      testId: id,
    });
    response.status(200).json(ResponseHandler.success(test));
  }

  @Post()
  async createNewTest(
    @Body('testDetails') testDetails: NewTestDto,
    @Res() response: Response,
  ) {
    const testId: TestIdDto = await this.testService.createNewTest(testDetails);
    response.status(200).json(ResponseHandler.success(testId));
  }

  @Put('/:testId')
  async updateTestInfo(
    @Param('testId') testId: number,
    @Body('testDetails') testDetails: TestInfoDto,
    @Res() response: Response,
  ) {
    const updateTestDetails: UpdateTestDto = {
      testId: testId,
      ...testDetails,
    };
    await this.testService.updateTestInfo(updateTestDetails);
    response.status(200).json(ResponseHandler.success());
  }

  @Delete('/:testId')
  async deleteTest(@Param('testId') id: number, @Res() response: Response) {
    await this.testService.deleteTest({ testId: id });
    response.status(200).json(ResponseHandler.success());
  }
}
