import { Injectable } from '@nestjs/common';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import { LoggerService } from '../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from '../test/test.entity';
import { DatabaseException, RedisException } from 'src/base/base.exception';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { IUpdateProgress } from '../attempt/attempt.entity';

@Injectable()
export class RabbitMQService {
  private context: string;

  constructor(
    private readonly loggerService: LoggerService,

    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,

    @InjectRedis()
    private readonly redis: Redis,
  ) {
    this.context = StackTrace.getSync().map((frame) =>
      path.basename(frame.fileName),
    )[0];
  }

  private getTrace(): string {
    const trace = StackTrace.getSync();
    return trace.map((frame) => frame.toString()).join('\n');
  }

  @RabbitSubscribe({
    exchange: 'progress-exchange',
    routingKey: 'update-progress',
    queue: 'uni-progress-queue',
  })
  public async pubSubHandler(data: IUpdateProgress) {
    this.loggerService.log(
      `Received message: ${JSON.stringify(data)}`,
      this.context,
    );
    const { courseId, userId } = data;
    try {
      const tests = await this.testRepository.find({
        relations: ['attempts', 'attempts.user'],
        where: {
          course: {
            courseId: courseId,
          },
        },
      });
      const numCompleted = tests
        .map((test) =>
          test.attempts
            .filter((attempt) => attempt.user.userId === userId)
            .filter((attempt) => attempt.submitted != null).length > 0
            ? 1
            : 0,
        )
        .reduce((x, y) => x + y, 0);
      const progress = Math.round((numCompleted / tests.length) * 100);
      try {
        await this.redis.hset(
          `course:${courseId}:user:${userId}`,
          `progress`,
          progress,
        );
        this.loggerService.log(
          `Saved user ${userId}'s progress to redis. Progress: ${progress}`,
          this.context,
        );
      } catch (error) {
        this.loggerService.error(
          `Error updating progress of course ${courseId} for user ${userId} to Redis`,
          this.context,
          this.getTrace(),
        );
        throw new RedisException();
      }
    } catch (error) {
      this.loggerService.error(
        `Error querying database for tests of course ${courseId} for user ${userId}: ${error}`,
        this.context,
        this.getTrace(),
      );
      throw new DatabaseException();
    }
  }
}
