import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { TestModule } from '../test/test.module';
import { QuestionModule } from '../question/question.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attempt } from './attempt.entity';
import { QuestionAttempt } from './question.attempt.entity';
import { AttemptController } from './attempt.controller';
import { AttemptService } from './attempt.service';

@Module({
  imports: [
    UserModule,
    TestModule,
    QuestionModule,
    TypeOrmModule.forFeature([Attempt, QuestionAttempt]),
  ],
  controllers: [AttemptController],
  providers: [AttemptService],
  exports: [AttemptService, TypeOrmModule],
})
export class AttemptModule {}
