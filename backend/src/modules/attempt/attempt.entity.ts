import { Test } from 'src/modules/test/test.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { QuestionAttempt } from './question.attempt.entity';

enum statuses {
  SUBMIT = 'submitted',
  AUTOSUBMIT = 'auto-submitted',
  PROGRESS = 'in-progress',
}

@Entity()
export class Attempt {
  @PrimaryGeneratedColumn()
  courseId: number;

  @Column({ length: 100 })
  title: string;

  @Column({
    type: 'enum',
    enum: statuses,
    default: statuses.PROGRESS,
  })
  status: statuses;

  @Column({ type: 'date' })
  start: Date; // the time when the user "starts" the test

  @Column({ type: 'date', nullable: true })
  end?: Date; // the time when the user MUST end the test

  @Column({ type: 'date', nullable: true })
  submitted?: Date;

  @ManyToOne(() => Test, (test) => test.attempts)
  test: Test;

  @ManyToMany(() => User, (user) => user.attempts)
  users?: User[];

  @OneToMany(
    () => QuestionAttempt,
    (questionAttempt) => questionAttempt.attempt,
  )
  questionAttempts?: QuestionAttempt[];
}
