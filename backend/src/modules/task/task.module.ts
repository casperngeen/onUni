import { Module } from '@nestjs/common';
import { TaskWorker } from './task.worker';
import { AttemptModule } from '../attempt/attempt.module';

@Module({
  imports: [AttemptModule],
  providers: [TaskWorker],
})
export class TaskModule {}
