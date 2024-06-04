import { Option } from './option.entity';
import { Test } from '../test/test.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  questionId: number;

  @Column('text')
  questionText: string;

  @ManyToOne(() => Test, (test) => test.questions)
  test: Test;

  @OneToMany(() => Option, (option) => option.question)
  options: Option[];
}
