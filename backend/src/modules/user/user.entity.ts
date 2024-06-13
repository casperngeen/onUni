import { Attempt } from '../attempt/attempt.entity';
import { Course } from 'src/modules/course/course.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export enum Roles {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

@Entity('onuni_user')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 100 })
  email: string;

  @Column('text')
  passwordHash: string;

  @Column({ type: 'int', nullable: true })
  emailToken: number;

  @Column('text', { nullable: true })
  refreshToken?: string;
  /*
  @Column({ type: 'longblob' })
  profile: string;
  */
  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.STUDENT,
  })
  role: Roles;

  @ManyToMany(() => Course, (course) => course.users, {
    cascade: true,
  })
  @JoinTable()
  courses: Course[];

  @OneToMany(() => Attempt, (attempt) => attempt.user, {
    cascade: true,
  })
  attempts: Attempt[];
}

export class UserIdDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;
}

export class PasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class EmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class LoginDto extends PasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SignUpDto extends LoginDto {
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}

export class EmailTokenDto {
  @IsNotEmpty()
  @IsInt()
  emailToken: number;
}

export class AuthTokenDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class PayloadDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}

export class RefreshDetailsDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
