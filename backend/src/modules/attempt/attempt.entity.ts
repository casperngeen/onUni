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
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionInfoDto, QuestionOrderDto } from '../question/question.entity';
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

  @Column({ type: 'timestamp', nullable: true })
  start: string; // the time when the user "starts" the test

  @Column({ type: 'timestamp', nullable: true })
  end: string | null; // the time when the user MUST end the test

  @Column({ type: 'timestamp', nullable: true })
  submitted: string | null;

  @Column('int', { nullable: true })
  score: number | null;

  @Column('jsonb', { nullable: true })
  questionOrder: QuestionOrderDto[];

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

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  score: number | null;

  @IsOptional()
  @IsInt()
  timeTaken: number | null;

  @IsOptional()
  @IsInt()
  timeRemaining: number | null;
}

export class AttemptHistory {
  @IsNotEmpty()
  @IsInt()
  attemptId: number;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsString()
  submitted: string | null;

  @IsOptional()
  @IsInt()
  score: number | null;
}

export interface IUpdateProgress {
  courseId: number;
  userId: number;
}
