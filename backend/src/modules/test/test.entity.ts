import { Course } from 'src/modules/course/course.entity';
import { Question } from 'src/modules/question/question.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Attempt } from '../attempt/attempt.entity';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ScoringFormats } from './test.enum';
import { TestTypes } from './test.enum';

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  testId: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'date', nullable: true })
  deadline?: string;

  @Column({
    type: 'enum',
    enum: ScoringFormats,
    nullable: true,
  })
  scoringFormat?: ScoringFormats;

  @Column({ type: 'int', nullable: true })
  maxAttempt?: number;

  @Column({ type: 'int', nullable: true })
  timeLimit?: number; // time in minutes

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

export class TestInfoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsOptional()
  deadline?: string;

  @IsEnum(ScoringFormats)
  @IsOptional()
  scoringFormat?: ScoringFormats;

  @IsInt()
  @IsOptional()
  maxAttempt?: number;

  @IsInt()
  @IsOptional()
  timeLimit?: number; // time in minutes

  @IsInt()
  @IsNotEmpty()
  maxScore: number; // should be an integer

  @IsEnum(TestTypes)
  @IsNotEmpty()
  testType: TestTypes;
}

export class NewTestDto extends TestInfoDto {
  @IsInt()
  @IsNotEmpty()
  courseId: number;
}

export class UpdateTestDto extends TestInfoDto {
  @IsInt()
  @IsNotEmpty()
  testId: number;
}
