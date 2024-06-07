import { Body, Controller, Get, Param, Res } from '@nestjs/common';
import { ResponseHandler } from 'src/base/base.response';
import { Response } from 'express';
import { TestService } from './test.service';
import { TestById } from './test.entity';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  async viewAllCourses(
    @Body('courseId') courseId: number,
    @Res() response: Response,
  ) {
    const tests: TestById = await this.testService.viewAllTests({
      courseId: courseId,
    });
    response.status(200).json(ResponseHandler.success(tests));
  }

  @Get('/:id')
  async viewCourseInformation(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    const test: TestById = await this.testService.viewTestInfo({
      testId: id,
    });
    response.status(200).json(ResponseHandler.success(test));
  }
}
