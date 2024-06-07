import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './test.entity';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [TypeOrmModule.forFeature([Test]), CourseModule],
  controllers: [TestController],
  providers: [TestService],
  exports: [TypeOrmModule, TestService],
})
export class TestModule {}
