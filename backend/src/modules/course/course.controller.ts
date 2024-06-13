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
import { CourseService } from './course.service';
import {
  CourseIdDto,
  CourseInfoDto,
  NewCourseDto,
  UpdateCourseDto,
  UserCourseDto,
} from './course.entity';
import { ResponseHandler } from 'src/base/base.response';
import { Response } from 'express';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async viewAllCourses(@Req() request: Request, @Res() response: Response) {
    const { userId } = request['user'];
    const courses: CourseInfoDto[] =
      await this.courseService.viewAllCoursesForUser({
        userId: userId,
      });
    response.status(200).json(ResponseHandler.success(courses));
  }

  @Get('/:courseId')
  async viewCourseInformation(
    @Param('courseId') courseId: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { userId } = request['user'];
    const course: CourseInfoDto = await this.courseService.viewCourseInfo(
      {
        courseId: courseId,
        userId: userId,
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
    const courseId: CourseIdDto =
      await this.courseService.createNewCourse(courseDetails);
    response.status(201).json(ResponseHandler.success(courseId));
  }

  @Put('/:courseId')
  async updateCourseInfo(
    @Param('courseId') courseId: number,
    @Body('courseDetails') courseDetails: NewCourseDto,
    @Res() response: Response,
  ) {
    const updateCourseObject: UpdateCourseDto = {
      courseId: courseId,
      ...courseDetails,
    };
    await this.courseService.updateCourseInfo(updateCourseObject);
    response.status(200).json(ResponseHandler.success());
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
