import { Question } from 'src/question/question.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  optionId: number;

  @Column('text')
  optionText: string;

  @Column()
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.options)
  question: Question;
}
