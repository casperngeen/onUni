import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { UserModule } from '../user/user.module';
import { CourseUserGuard } from './course.user.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), UserModule],
  controllers: [CourseController],
  providers: [CourseService, CourseUserGuard],
  exports: [TypeOrmModule, CourseService, CourseUserGuard],
})
export class CourseModule {}
