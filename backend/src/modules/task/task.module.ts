import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { AttemptModule } from '../attempt/attempt.module';

@Module({
  imports: [AttemptModule],
  providers: [TaskService],
})
export class TaskModule {}
