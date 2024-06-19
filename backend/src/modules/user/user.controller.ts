import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { ResponseHandler } from 'src/base/base.response';
import { NewUserDto, User, UserIdDto } from './user.entity';

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

  @Post('user/teacher')
  async createNewTeacher(
    @Body('userDetails') userDetails: NewUserDto,
    @Res() response: Response,
  ) {
    const userId: UserIdDto =
      await this.userService.createNewTeacher(userDetails);
    response.status(201).json(ResponseHandler.success(userId));
  }

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

  @Delete('user/:userId')
  async removeUser(@Param('userId') id: number, @Res() response: Response) {
    await this.userService.removeUser({ userId: id });
    response.status(200).json(ResponseHandler.success());
  }
}
