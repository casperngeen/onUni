import { Test } from 'src/modules/test/test.entity';
import { Roles, User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import {
  IsEnum,
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  courseId: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @OneToMany(() => Test, (test) => test.course)
  tests: Test[];

  @ManyToMany(() => User, (user) => user.courses, {
    onDelete: 'CASCADE',
  })
  users: User[];
}

export class CourseIdDto {
  @IsInt()
  @IsNotEmpty()
  courseId: number;
}

export class ViewCourseDto extends CourseIdDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;
}

export class NewCourseDetailsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  startDate: Date;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  endDate: Date;
}

export class NewCourseDto extends NewCourseDetailsDto {
  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;

  @IsInt()
  @IsNotEmpty()
  adminId: number;
}

export class AddUserToCourseDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  courseId: number;

  @IsInt()
  @IsNotEmpty()
  adminId: number;

  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}

export class UpdateCourseDto extends NewCourseDto {
  @IsInt()
  @IsNotEmpty()
  courseId: number;
}

export class CourseInfoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  startDate: Date;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  endDate: Date;

  @IsNotEmpty()
  @IsInt()
  courseId: number;
}

export class DeleteCourseDto extends CourseIdDto {
  @IsInt()
  @IsNotEmpty()
  adminId: number;

  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}
