import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import BaseService from 'src/base/base.service';
import { Attempt } from '../attempt/attempt.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as StackTrace from 'stacktrace-js';
import * as path from 'path';
import { IsNull, LessThan, Not, Repository } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { AttemptService } from '../attempt/attempt.service';

@Injectable()
export class TaskService extends BaseService<Attempt> {
  constructor(
    @InjectRepository(Attempt)
    private readonly attemptRepository: Repository<Attempt>,
    private readonly attemptService: AttemptService,
    loggerService: LoggerService,
  ) {
    super(attemptRepository, loggerService);
    this.context = StackTrace.getSync().map((frame) =>
      path.basename(frame.fileName),
    )[0];
  }

  // scheduled for once per day at 12mn
  @Cron('0 0 * * *')
  async handleCron() {
    this.log(
      'Cron-job to auto-submit all attempts that are overdue',
      this.context,
    );
    this.log('Querying all unsubmitted attempts...', this.context);
    const unsubmittedAttempts = await this.find({
      where: {
        test: {
          timeLimit: Not(IsNull()),
        },
        end: LessThan(new Date().toISOString()),
        submitted: IsNull(),
      },
      relations: ['test'],
    });
    this.log('Query for all unsubmitted attempts completed', this.context);
    for (const attempt of unsubmittedAttempts) {
      await this.attemptService.submitAttempt({ attemptId: attempt.attemptId });
    }
    this.log(
      'Cron-job to auto-submit all attempts that are overdue completed',
      this.context,
    );
  }
}
