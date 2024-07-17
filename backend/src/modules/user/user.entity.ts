import { Attempt } from '../attempt/attempt.entity';
import { Roles } from './user.enum';
import { Course } from 'src/modules/course/course.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
  refreshToken: string | null;

  @Column('text', { nullable: true })
  profilePic: string;

  @Column('text', { default: 'Person' })
  name: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.STUDENT,
  })
  role: Roles;

  @ManyToMany(() => Course, (course) => course.users, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  courses: Course[];

  @OneToMany(() => Attempt, (attempt) => attempt.user)
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

export class NewUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SignUpDto extends LoginDto {
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  profilePic: string;
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

export class LoginResponseDto extends AuthTokenDto {
  @IsOptional()
  @IsString()
  profilePic: string;

  @IsNotEmpty()
  @IsString()
  name: string;
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
