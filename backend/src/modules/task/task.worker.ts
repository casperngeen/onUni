import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Attempt } from '../attempt/attempt.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import { IsNull, LessThan, Not, Repository } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { AttemptService } from '../attempt/attempt.service';

@Injectable()
export class TaskWorker {
  constructor(
    @InjectRepository(Attempt)
    private readonly attemptRepository: Repository<Attempt>,
    private readonly attemptService: AttemptService,
    private readonly loggerService: LoggerService,
    private context = StackTrace.getSync().map((frame) =>
      path.basename(frame.fileName),
    )[0],
  ) {}

  // scheduled for once per day at 12mn
  @Cron('0 0 * * *')
  async handleCron() {
    this.loggerService.log(
      'Cron-job to auto-submit all attempts that are overdue',
      this.context,
    );
    this.loggerService.log(
      'Querying all unsubmitted attempts...',
      this.context,
    );
    const unsubmittedAttempts = await this.attemptRepository.find({
      where: {
        test: {
          timeLimit: Not(IsNull()),
        },
        end: LessThan(new Date().toISOString()),
        submitted: IsNull(),
      },
      relations: ['test'],
    });
    this.loggerService.log(
      'Query for all unsubmitted attempts completed',
      this.context,
    );
    for (const attempt of unsubmittedAttempts) {
      await this.attemptService.submitAttempt({ attemptId: attempt.attemptId });
    }
    this.loggerService.log(
      'Cron-job to auto-submit all attempts that are overdue completed',
      this.context,
    );
  }
}
