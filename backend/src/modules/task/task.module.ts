import { Module } from '@nestjs/common';
import { TaskWorker } from './task.worker';
import { AttemptModule } from '../attempt/attempt.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [AttemptModule, LoggerModule],
  providers: [TaskWorker],
})
export class TaskModule {}
