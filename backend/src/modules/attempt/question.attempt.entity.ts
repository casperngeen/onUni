import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../question/question.entity.js';
import { Attempt } from './attempt.entity.js';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { AnswerStatus } from './attempt.enum.js';

@Entity()
export class QuestionAttempt {
  @PrimaryGeneratedColumn()
  questionAttemptId: number;

  @Column()
  selectedOptionId: number;

  @Column({
    type: 'enum',
    enum: AnswerStatus,
    nullable: true,
  })
  answerStatus: AnswerStatus;

  @ManyToOne(() => Question, (question) => question.questionId, {
    onDelete: 'CASCADE',
  })
  question: Question;

  @ManyToOne(() => Attempt, (attempt) => attempt.questionAttempts, {
    onDelete: 'CASCADE',
  })
  attempt: Attempt;
}

export class QuestionAttemptInfoDto {
  @IsInt()
  @IsNotEmpty()
  questionId: number;

  @IsInt()
  @IsNotEmpty()
  selectedOptionId: number;
}

export class NewQuestionAttemptDto extends QuestionAttemptInfoDto {
  @IsInt()
  @IsNotEmpty()
  attemptId: number;
}

export class SubmitQuestionAttemptDto {
  @IsInt()
  @IsNotEmpty()
  questionId: number;

  @IsInt()
  @IsNotEmpty()
  selectedOptionId: number;
}

export class QuestionAttemptIdDto {
  @IsInt()
  @IsNotEmpty()
  questionAttemptId: number;
}

export class QuestionAttemptResponseDto extends QuestionAttemptInfoDto {
  @IsOptional()
  @IsEnum(AnswerStatus)
  answerStatus: AnswerStatus | null;
}

export class UpdateQuestionAttemptDto extends QuestionAttemptInfoDto {
  @IsInt()
  @IsNotEmpty()
  attemptId: number;
}

export class RedisOptionDto {
  @IsInt()
  @IsNotEmpty()
  selectedOptionId: number;
}
