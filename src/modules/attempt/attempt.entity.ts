import { Test } from 'src/modules/test/test.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

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

  @OneToMany(() => Test, (test) => test.course)
  tests: Test[];

  @ManyToMany(() => User, (user) => user.attempts)
  users: User[];
}
