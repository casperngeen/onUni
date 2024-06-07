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
import { CourseService } from './course.service';
import { Course, NewCourseDto, UserCourseDto } from './course.entity';
import { ResponseHandler } from 'src/base/base.response';
import { Response } from 'express';
import { PayloadDto } from '../user/user.entity';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async viewAllCourses(
    @Body('user') payload: PayloadDto,
    @Res() response: Response,
  ) {
    const courses: Course[] = await this.courseService.viewAllCoursesForUser({
      userId: payload.userId,
    });
    response.status(200).json(ResponseHandler.success(courses));
  }

  @Get('/:id')
  async viewCourseInformation(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    const course: Course = await this.courseService.viewCourseInfo(
      {
        courseId: id,
      },
      true,
    );
    response.status(200).json(ResponseHandler.success(course));
  }

  @Post()
  async createNewCourse(
    @Body('courseDetails') courseDetails: NewCourseDto,
    @Res() response: Response,
  ) {
    await this.courseService.createNewCourse(courseDetails);
    response.status(201).json(ResponseHandler.success());
  }

  @Put('/:courseId/user/:userId')
  async addUsertoCourse(
    @Param('courseId') courseId: number,
    @Param('userId') userId: number,
    @Res() response: Response,
  ) {
    const userCourse: UserCourseDto = {
      userId: userId,
      courseId: courseId,
    };
    await this.courseService.addUserToCourse(userCourse);
    response.status(200).json(ResponseHandler.success());
  }

  @Delete('/:courseId/user/:userId')
  async removeUserfromCourse(
    @Param('courseId') courseId: number,
    @Param('userId') userId: number,
    @Res() response: Response,
  ) {
    const userCourse: UserCourseDto = {
      userId: userId,
      courseId: courseId,
    };
    await this.courseService.removeUserFromCourse(userCourse);
    response.status(200).json(ResponseHandler.success());
  }

  @Delete('/:id')
  async deleteCourse(@Param('id') courseId: number, @Res() response: Response) {
    await this.courseService.deleteCourse({ courseId: courseId });
    response.status(200).json(ResponseHandler.success());
  }
}
