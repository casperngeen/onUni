import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../question/question.entity.js';
import { Attempt } from './attempt.entity.js';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export enum AnswerStatus {
  UNATTEMPTED = 'unattempted',
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
}

@Entity()
export class QuestionAttempt {
  @PrimaryGeneratedColumn()
  questionAttemptId: number;

  @Column({ nullable: true })
  selectedOptionId?: number;

  @Column({
    type: 'enum',
    enum: AnswerStatus,
    default: AnswerStatus.UNATTEMPTED,
  })
  answerStatus: AnswerStatus;

  @ManyToOne(() => Question)
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
  questionAttemptId: number;

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
  @IsNotEmpty()
  @IsEnum(AnswerStatus)
  answerStatus: AnswerStatus;
}
