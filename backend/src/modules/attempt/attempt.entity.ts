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
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Status {
  SUBMIT = 'submitted',
  AUTOSUBMIT = 'auto-submitted',
  PROGRESS = 'in-progress',
}

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
  start: Date; // the time when the user "starts" the test

  @Column({ type: 'date', nullable: true })
  end?: Date; // the time when the user MUST end the test

  @Column({ type: 'date', nullable: true })
  submitted?: Date;

  @Column('decimal', { nullable: true, precision: 7, scale: 3 })
  score?: number;

  @OneToMany(
    () => QuestionAttempt,
    (questionAttempt) => questionAttempt.attempt,
    {
      cascade: true,
    },
  )
  questionAttempts: QuestionAttempt[];

  @ManyToOne(() => Test, (test) => test.attempts)
  test: Test;

  @ManyToOne(() => User, (user) => user.attempts)
  user: User;
}

export class NewAttemptDto {
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  start: Date;

  @IsISO8601({ strict: true })
  end?: Date;

  @IsNotEmpty()
  @IsInt()
  testId: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}

export class AttemptIdDto {
  @IsNotEmpty()
  @IsInt()
  attemptId: number;
}

export class SubmitAttemptInfoDto {
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  submitted: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitQuestionAttemptDto)
  questionAttempts: SubmitQuestionAttemptDto[];
}

export class SubmitAttemptDto extends SubmitAttemptInfoDto {
  @IsNotEmpty()
  @IsInt()
  attemptId: number;
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
  start: Date;

  @IsISO8601({ strict: true })
  end?: Date;

  @IsISO8601({ strict: true })
  submitted?: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  score?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAttemptResponseDto)
  questionAttempts: QuestionAttemptResponseDto[];
}
