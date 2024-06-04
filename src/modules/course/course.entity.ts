import { Test } from 'src/modules/test/test.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  courseId: number;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @OneToMany(() => Test, (test) => test.course)
  tests: Test[];

  @ManyToMany(() => User, (user) => user.courses)
  users: User[];
}
