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
  CourseInfoWithTestsDto,
  NewCourseDetailsDto,
  UpdateCourseDto,
  ViewAllCourseResponseDto,
} from './course.entity';
import { ResponseHandler } from 'src/base/base.response';
import { Response } from 'express';
import { TeacherGuard } from '../user/teacher.guard';
import { CourseUserGuard } from './course.user.guard';
import { PayloadDto, UserIdDto } from '../user/user.entity';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async viewAllCourses(@Req() request: Request, @Res() response: Response) {
    const { userId, role } = request['user'] as PayloadDto;
    const allCourseResponse: ViewAllCourseResponseDto =
      await this.courseService.viewAllCoursesForUser({
        userId: userId,
        role: role,
      });
    response.status(200).json(ResponseHandler.success(allCourseResponse));
  }

  @UseGuards(CourseUserGuard)
  @Get('/:courseId')
  async viewCourseInformation(
    @Param('courseId') courseId: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { userId } = request['user'] as PayloadDto;
    const course: CourseInfoWithTestsDto =
      await this.courseService.viewCourseInfoForUser({
        courseId: courseId,
        userId: userId,
      });
    response.status(200).json(ResponseHandler.success(course));
  }

  @UseGuards(TeacherGuard)
  @Post()
  async createNewCourse(
    @Body() courseDetails: NewCourseDetailsDto,
    @Res() response: Response,
  ) {
    const courseId: CourseIdDto =
      await this.courseService.createNewCourse(courseDetails);
    response.status(201).json(ResponseHandler.success(courseId));
  }

  @UseGuards(TeacherGuard)
  @Put('/:courseId')
  async updateCourseInfo(
    @Param('courseId') courseId: number,
    @Body() courseDetails: NewCourseDetailsDto,
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
  @Put('/:courseId/user')
  async addUsertoCourse(
    @Param('courseId') courseId: number,
    @Body() userId: UserIdDto,
    @Res() response: Response,
  ) {
    const userCourse: AddUserToCourseDto = {
      ...userId,
      courseId: courseId,
    };
    await this.courseService.addUserToCourse(userCourse);
    response.status(200).json(ResponseHandler.success());
  }

  @UseGuards(TeacherGuard)
  @Delete('/:courseId/user')
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
