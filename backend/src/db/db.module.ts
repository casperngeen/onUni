import { Module } from '@nestjs/common';
import { databaseProviders } from './db.providers';

// to allow the rest of the app to access
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
