import { Test } from 'src/modules/test/test.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  QuestionAttempt,
  QuestionAttemptResponseDto,
  SubmitQuestionAttemptDto,
} from './question.attempt.entity';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionInfoDto } from '../question/question.entity';
import { Status } from './attempt.enum';
import { TestTypes } from '../test/test.enum';

@Entity()
export class Attempt {
  @PrimaryGeneratedColumn()
  attemptId: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PROGRESS,
  })
  status: Status;

  @Column({ type: 'date' })
  start: string; // the time when the user "starts" the test

  @Column({ type: 'date', nullable: true })
  end: string | null; // the time when the user MUST end the test

  @Column({ type: 'date', nullable: true })
  submitted: string | null;

  @Column('decimal', { nullable: true, precision: 7, scale: 3 })
  score: number | null;

  @OneToMany(
    () => QuestionAttempt,
    (questionAttempt) => questionAttempt.attempt,
    {
      cascade: true,
    },
  )
  questionAttempts: QuestionAttempt[];

  @ManyToOne(() => Test, (test) => test.attempts, {
    onDelete: 'CASCADE',
  })
  test: Test;

  @ManyToOne(() => User, (user) => user.attempts, {
    onDelete: 'CASCADE',
  })
  user: User;
}

export class AttemptIdDto {
  @IsNotEmpty()
  @IsInt()
  attemptId: number;
}

export class SubmitAttemptInfoDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitQuestionAttemptDto)
  questionAttempts: SubmitQuestionAttemptDto[];
}

export class SubmitAttemptDto {
  @IsNotEmpty()
  @IsInt()
  attemptId: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}

export class UserTestDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  testId: number;
}

export class AttemptInfoDto {
  @IsNotEmpty()
  @IsInt()
  attemptId: number;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  start: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  end: string | null;

  @IsOptional()
  @IsISO8601({ strict: true })
  submitted: string | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  score: number | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAttemptResponseDto)
  questionAttempts: QuestionAttemptResponseDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionInfoDto)
  questions: QuestionInfoDto[];

  @IsNotEmpty()
  @IsString()
  testTitle: string;

  @IsNotEmpty()
  @IsString()
  courseTitle: string;

  @IsEnum(TestTypes)
  @IsNotEmpty()
  testType: TestTypes;
}

export class AttemptResponseDto {
  @IsNotEmpty()
  @IsInt()
  attemptId: number;

  @IsNotEmpty()
  @IsString()
  testTitle: string;

  @IsNotEmpty()
  @IsString()
  courseTitle: string;

  @IsOptional()
  @IsInt()
  timeLimit: number | null;

  @IsEnum(TestTypes)
  @IsNotEmpty()
  testType: TestTypes;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionInfoDto)
  questions: QuestionInfoDto[];
}
