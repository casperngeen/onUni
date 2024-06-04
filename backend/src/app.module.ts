import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

dotenv.config();

@Module({
  imports: [
    // to be updated: to connect with DB
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'onuni',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
