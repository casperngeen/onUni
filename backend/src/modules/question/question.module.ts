import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './option.entity';
import { Question } from './question.entity';
import { TestModule } from '../test/test.module';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Option]),
    TestModule,
    CourseModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [TypeOrmModule, QuestionService],
})
export class QuestionModule {}
