import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { ResponseHandler } from 'src/base/base.response';
import { NewUserDto, User, UserIdDto } from './user.entity';
import { TeacherGuard } from './teacher.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('course/:courseId/students')
  async findStudentsInCourse(
    @Param('courseId') id: number,
    @Res() response: Response,
  ) {
    const students: Partial<User>[] =
      await this.userService.findStudentsInCourse({
        courseId: id,
      });
    response.status(200).json(ResponseHandler.success(students));
  }

  @Get('course/:courseId/teachers')
  async findTeachersInCourse(
    @Param('courseId') id: number,
    @Res() response: Response,
  ) {
    const teachers: Partial<User>[] =
      await this.userService.findTeachersInCourse({
        courseId: id,
      });
    response.status(200).json(ResponseHandler.success(teachers));
  }

  @UseGuards(TeacherGuard)
  @Post('user/teacher')
  async createNewTeacher(
    @Body('email') email: string,
    @Res() response: Response,
  ) {
    const userId: UserIdDto = await this.userService.createNewTeacher({
      email: email,
    });
    response.status(201).json(ResponseHandler.success(userId));
  }

  @UseGuards(TeacherGuard)
  @Post('user/student')
  async createNewStudent(
    @Body('userDetails') userDetails: NewUserDto,
    @Res() response: Response,
  ) {
    const userId: UserIdDto =
      await this.userService.createNewStudent(userDetails);
    response.status(201).json(ResponseHandler.success(userId));
  }

  // change profile pic?
  //   @Put('/:userId')
  //   async updateUserDetails(
  //     @Param('userId') id: number,
  //     @Res() response: Response,
  //   ) {

  //   }

  @UseGuards(TeacherGuard)
  @Delete('user/:userId')
  async removeUser(@Param('userId') userId: number, @Res() response: Response) {
    await this.userService.removeUser({ userId: userId });
    response.status(200).json(ResponseHandler.success());
  }
}
