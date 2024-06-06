import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), UserModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [TypeOrmModule, CourseService],
})
export class CourseModule {}
