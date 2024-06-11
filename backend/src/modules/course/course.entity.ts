import { Test } from 'src/modules/test/test.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { IsISO8601, IsInt, IsNotEmpty, IsString } from 'class-validator';

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

  @OneToMany(() => Test, (test) => test.course, {
    cascade: true,
  })
  tests: Test[];

  @ManyToMany(() => User, (user) => user.courses)
  users: User[];
}

export class CourseIdDto {
  @IsInt()
  @IsNotEmpty()
  courseId: number;
}

export class NewCourseDto {
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

export class UserCourseDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  courseId: number;
}

export class UpdateCourseDto {
  courseId: number;

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

export class CourseInfoDto extends NewCourseDto {
  @IsNotEmpty()
  @IsInt()
  courseId: number;
}
