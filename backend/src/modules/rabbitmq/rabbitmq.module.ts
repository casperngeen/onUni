import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { LoggerModule } from '../logger/logger.module';
import { TestModule } from '../test/test.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    LoggerModule,
    TestModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'progress-exchange',
          type: 'topic',
        },
      ],
      uri: process.env.RABBIT_MQ_URL,
      connectionInitOptions: { wait: false },
      channels: {
        'channel-1': {
          prefetchCount: 15,
          default: true,
        },
      },
    }),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService, RabbitMQModule],
})
export class RabbitMQUniModule {}
