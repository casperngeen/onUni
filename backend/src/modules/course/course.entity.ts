import { Test } from 'src/modules/test/test.entity';
import { User } from '../user/user.entity';
import { Roles } from '../user/user.enum';
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
  startDate: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  endDate: string;
}

export class NewCourseDto extends NewCourseDetailsDto {
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;

  @IsNotEmpty()
  @IsInt()
  adminId: number;
}

export class AddUserToCourseDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  courseId: number;
}

export class UpdateCourseDto extends NewCourseDetailsDto {
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
  startDate: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  endDate: string;

  @IsNotEmpty()
  @IsInt()
  courseId: number;
}
