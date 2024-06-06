import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../question/question.entity.js';
import { Attempt } from './attempt.entity.js';

@Entity()
export class QuestionAttempt {
  @PrimaryGeneratedColumn()
  questionAttemptId: number;

  @Column()
  selectedOptionId: number;

  @ManyToOne(() => Question)
  question: Question;

  @ManyToOne(() => Attempt, (attempt) => attempt.questionAttempts)
  attempt: Attempt;
}
