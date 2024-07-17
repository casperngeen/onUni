import {
  ITestInfoWithAttemptInfo,
  NextTestDto,
  Test,
} from 'src/modules/test/test.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import {
  IsArray,
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  courseId: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

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

export class ViewCourseInfoQueryDto extends CourseIdDto {
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

class CourseInfoWithoutDescriptionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

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

export class AllCourseInfoDto extends CourseInfoWithoutDescriptionDto {
  @IsNotEmpty()
  @IsInt()
  progress: number;
}

export class CourseInfoWithTestsDto extends UpdateCourseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ITestInfoWithAttemptInfo)
  tests: ITestInfoWithAttemptInfo[];
}

export class ViewAllCourseResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllCourseInfoDto)
  courses: AllCourseInfoDto[];

  @IsOptional()
  @Type(() => NextTestDto)
  nextTest: NextTestDto | null;
}
