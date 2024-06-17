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
  AddUserToCourseDto,
  CourseIdDto,
  CourseInfoDto,
  NewCourseDetailsDto,
  NewCourseDto,
  UpdateCourseDto,
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
    @Body('courseDetails') courseDetails: NewCourseDetailsDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { userId, role } = request['user'];
    const courseId: CourseIdDto = await this.courseService.createNewCourse({
      ...courseDetails,
      adminId: userId,
      role: role,
    });
    response.status(201).json(ResponseHandler.success(courseId));
  }

  @Put('/:courseId')
  async updateCourseInfo(
    @Param('courseId') courseId: number,
    @Body('courseDetails') courseDetails: NewCourseDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { userId, role } = request['user'];
    const updateCourseObject: UpdateCourseDto = {
      courseId: courseId,
      ...courseDetails,
      adminId: userId,
      role: role,
    };
    await this.courseService.updateCourseInfo(updateCourseObject);
    response.status(200).json(ResponseHandler.success());
  }

  @Put('/:courseId')
  async addUsertoCourse(
    @Param('courseId') courseId: number,
    @Body('userId') userId: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { role, userId: adminId } = request['user'];
    const userCourse: AddUserToCourseDto = {
      userId: userId,
      courseId: courseId,
      adminId: adminId,
      role: role,
    };
    await this.courseService.addUserToCourse(userCourse);
    response.status(200).json(ResponseHandler.success());
  }

  @Delete('/:courseId')
  async removeUserfromCourse(
    @Param('courseId') courseId: number,
    @Body('userId') userId: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { role, userId: adminId } = request['user'];
    const userCourse: AddUserToCourseDto = {
      userId: userId,
      courseId: courseId,
      adminId: adminId,
      role: role,
    };
    await this.courseService.removeUserFromCourse(userCourse);
    response.status(200).json(ResponseHandler.success());
  }

  @Delete('/:courseId')
  async deleteCourse(
    @Param('id') courseId: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { userId, role } = request['user'];
    await this.courseService.deleteCourse({
      courseId: courseId,
      adminId: userId,
      role: role,
    });
    response.status(200).json(ResponseHandler.success());
  }
}
