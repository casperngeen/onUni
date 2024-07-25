import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { Course } from './modules/course/course.entity';
import { Question } from './modules/question/question.entity';
import { QuestionAttempt } from './modules/attempt/question.attempt.entity';
import { Option } from './modules/question/option.entity';
import { Test } from './modules/test/test.entity';
import { Attempt } from './modules/attempt/attempt.entity';
import { LoggerModule } from './modules/logger/logger.module';
import { TestModule } from './modules/test/test.module';
import { CourseModule } from './modules/course/course.module';
import { AttemptModule } from './modules/attempt/attempt.module';
import { QuestionModule } from './modules/question/question.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRootAsync({
      useFactory: () => ({
        // single means single node/server, cluster is multiple servers
        type: 'single',
        url: process.env.REDIS_URL,
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'onuni',
      entities: [
        Attempt,
        QuestionAttempt,
        Course,
        Question,
        Option,
        Test,
        User,
      ],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    TaskModule,
    AuthModule,
    CourseModule,
    LoggerModule,
    TestModule,
    UserModule,
    AttemptModule,
    QuestionModule,
  ],
})
export class AppModule {}
