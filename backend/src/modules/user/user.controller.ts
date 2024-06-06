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
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('student/:courseId')
  async findStudentsInCourse(
    @Param('courseId') id: number,
    @Res() response: Response,
  ) {
    const students: User[] = await this.userService.findStudentsInCourse({
      courseId: id,
    });
    response.status(200).json(ResponseHandler.success(students));
  }

  @Get('teacher/:courseId')
  async findTeachersInCourse(
    @Param('courseId') id: number,
    @Res() response: Response,
  ) {
    const teachers: User[] = await this.userService.findTeachersInCourse({
      courseId: id,
    });
    response.status(200).json(ResponseHandler.success(teachers));
  }

  @Post()
  async createNewTeacher(
    @Body('email') email: string,
    @Res() response: Response,
  ) {
    await this.userService.createNewTeacher({ email: email });
    response.status(201).json(ResponseHandler.success());
  }

  @Post()
  async createNewStudent(
    @Body('email') email: string,
    @Res() response: Response,
  ) {
    await this.userService.createNewStudent({ email: email });
    response.status(201).json(ResponseHandler.success());
  }

  //   @Put('/:userId')
  //   async updateUserDetails(
  //     @Param('userId') id: number,
  //     @Res() response: Response,
  //   ) {

  //   }

  @Delete('/:userId')
  async removeUser(@Param('userId') id: number, @Res() response: Response) {
    await this.userService.removeUser({ userId: id });
    response.status(200).json(ResponseHandler.success());
  }
}
