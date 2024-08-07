import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { TestModule } from '../test/test.module';
import { QuestionModule } from '../question/question.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attempt } from './attempt.entity';
import { QuestionAttempt } from './question.attempt.entity';
import { AttemptController } from './attempt.controller';
import { AttemptService } from './attempt.service';
import { CourseModule } from '../course/course.module';
import { AttemptTeacherGuard } from './attempt.teacher.guard';
import { AttemptUserGuard } from './attempt.user.guard';
import { RabbitMQUniModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    UserModule,
    TestModule,
    QuestionModule,
    CourseModule,
    RabbitMQUniModule,
    TypeOrmModule.forFeature([Attempt, QuestionAttempt]),
  ],
  controllers: [AttemptController],
  providers: [AttemptService, AttemptTeacherGuard, AttemptUserGuard],
  exports: [AttemptService, TypeOrmModule],
})
export class AttemptModule {}
