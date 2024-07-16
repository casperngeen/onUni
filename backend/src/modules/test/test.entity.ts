import { Course } from 'src/modules/course/course.entity';
import { Question } from 'src/modules/question/question.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Attempt, AttemptHistory } from '../attempt/attempt.entity';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ScoringFormats } from './test.enum';
import { TestTypes } from './test.enum';
import { Type } from 'class-transformer';

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  testId: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  start: string | null;

  @Column({ type: 'timestamp', nullable: true })
  deadline: string | null;

  @Column({
    type: 'enum',
    enum: ScoringFormats,
    nullable: true,
  })
  scoringFormat: ScoringFormats | null;

  @Column({ type: 'int', nullable: true })
  maxAttempt: number | null;

  @Column({ type: 'int', nullable: true })
  timeLimit: number | null; // time in minutes

  @Column({ type: 'int' })
  maxScore: number; // should be an integer

  @Column({
    type: 'enum',
    enum: TestTypes,
  })
  testType: TestTypes;

  @ManyToOne(() => Course, (course) => course.tests, {
    onDelete: 'CASCADE',
  })
  course: Course;

  @OneToMany(() => Question, (question) => question.test)
  questions: Question[];

  @OneToMany(() => Attempt, (attempt) => attempt.test)
  attempts: Attempt[];
}

export class TestIdDto {
  @IsInt()
  @IsNotEmpty()
  testId: number;
}

export class AttemptTestIdDto extends TestIdDto {
  @IsInt()
  @IsNotEmpty()
  attemptId: number;
}

class TestDetailsDto {
  @IsString()
  @IsNotEmpty()
  testTitle: string;

  @IsString()
  @IsNotEmpty()
  testDescription: string;

  @IsISO8601()
  @IsOptional()
  start: string | null;

  @IsISO8601()
  @IsOptional()
  deadline: string | null;

  @IsEnum(ScoringFormats)
  @IsOptional()
  scoringFormat: ScoringFormats | null;

  @IsInt()
  @IsOptional()
  maxAttempt: number | null;

  @IsInt()
  @IsOptional()
  timeLimit: number | null; // time in minutes

  @IsInt()
  @IsNotEmpty()
  maxScore: number;

  @IsEnum(TestTypes)
  @IsNotEmpty()
  testType: TestTypes;
}

export class NewTestDto extends TestDetailsDto {
  @IsInt()
  @IsNotEmpty()
  courseId: number;
}

export class UpdateTestDto extends TestDetailsDto {
  @IsInt()
  @IsNotEmpty()
  testId: number;
}

export class TestInfoDto extends UpdateTestDto {}

export class ITestInfoWithAttemptInfo extends TestInfoDto {
  currScore: number | null;
  numOfAttempts: number;
}

export class AllTestInfoDto extends TestInfoDto {
  completed: boolean;
}

export class TestInfoWithHistoryDto extends TestInfoDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttemptHistory)
  attempts: AttemptHistory[];

  @IsNotEmpty()
  @IsString()
  courseTitle: string;
}

export class NextTestDto {
  @IsNotEmpty()
  @IsInt()
  courseId: number;

  @IsNotEmpty()
  @IsInt()
  testId: number;

  @IsNotEmpty()
  @IsEnum(TestTypes)
  testType: TestTypes;

  @IsNotEmpty()
  @IsString()
  testTitle: string;

  @IsNotEmpty()
  @IsString()
  courseTitle: string;
}
