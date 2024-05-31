import { Attempt } from 'src/attempt/attempt.entity';
import { Course } from 'src/course/course.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export enum roles {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 100 })
  email: string;

  @Column('text')
  passwordHash: string;

  @Column('text', { nullable: true })
  token?: string;

  @Column('text', { nullable: true })
  refreshToken?: string;
  /*
  @Column({ type: 'longblob' })
  profile: string;
  */
  @Column({
    type: 'enum',
    enum: roles,
    default: roles.STUDENT,
  })
  role: roles;

  @ManyToMany(() => Course, (course) => course.users)
  courses?: Course[];

  @ManyToMany(() => Attempt, (attempt) => attempt.users)
  attempts?: Attempt[];
}

export class PasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class EmailDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class LoginDto extends PasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SignUpDto extends LoginDto {
  @IsNotEmpty()
  @IsEnum(roles)
  role: roles;
}

export class SingleTokenDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}

export class DoubleTokenDto extends SingleTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class PayloadDto {
  @IsInt()
  userId: number;

  @IsEnum(roles)
  role: roles;
}
