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
import { CourseService } from './course.service';
import {
  AddUserToCourseDto,
  CourseIdDto,
  CourseInfoDto,
  NewCourseDetailsDto,
  UpdateCourseDto,
} from './course.entity';
import { ResponseHandler } from 'src/base/base.response';
import { Response } from 'express';
import { TeacherGuard } from './teacher.guard';
import { CourseUserGuard } from './course.user.guard';
import { Roles } from '../user/user.enum';

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

  @UseGuards(CourseUserGuard)
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
    const userRole: Roles = Roles[role as keyof typeof Roles];
    const courseId: CourseIdDto = await this.courseService.createNewCourse({
      ...courseDetails,
      adminId: userId,
      role: userRole,
    });
    response.status(201).json(ResponseHandler.success(courseId));
  }

  @UseGuards(TeacherGuard)
  @Put('/:courseId')
  async updateCourseInfo(
    @Param('courseId') courseId: number,
    @Body('courseDetails') courseDetails: NewCourseDetailsDto,
    @Res() response: Response,
  ) {
    const updateCourseObject: UpdateCourseDto = {
      courseId: courseId,
      ...courseDetails,
    };
    await this.courseService.updateCourseInfo(updateCourseObject);
    response.status(200).json(ResponseHandler.success());
  }

  @UseGuards(TeacherGuard)
  @Put('/:courseId')
  async addUsertoCourse(
    @Param('courseId') courseId: number,
    @Body('userId') userId: number,
    @Res() response: Response,
  ) {
    const userCourse: AddUserToCourseDto = {
      userId: userId,
      courseId: courseId,
    };
    await this.courseService.addUserToCourse(userCourse);
    response.status(200).json(ResponseHandler.success());
  }

  @UseGuards(TeacherGuard)
  @Delete('/:courseId')
  async removeUserfromCourse(
    @Param('courseId') courseId: number,
    @Body('userId') userId: number,
    @Res() response: Response,
  ) {
    const userCourse: AddUserToCourseDto = {
      userId: userId,
      courseId: courseId,
    };
    await this.courseService.removeUserFromCourse(userCourse);
    response.status(200).json(ResponseHandler.success());
  }

  @UseGuards(TeacherGuard)
  @Delete('/:courseId')
  async deleteCourse(
    @Param('courseId') courseId: number,
    @Res() response: Response,
  ) {
    await this.courseService.deleteCourse({
      courseId: courseId,
    });
    response.status(200).json(ResponseHandler.success());
  }
}
