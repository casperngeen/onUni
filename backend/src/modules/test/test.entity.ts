import { Course } from 'src/modules/course/course.entity';
import { Question } from 'src/modules/question/question.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Attempt } from '../attempt/attempt.entity';

enum scoringFormats {
  AVERAGE = 'average',
  HIGHEST = 'highest',
  LATEST = 'latest',
}

enum testTypes {
  PRACTICE = 'practice',
  EXAM = 'exam',
  QUIZ = 'quiz',
}

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  testId: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'date', nullable: true })
  deadline?: Date;

  @Column({
    type: 'enum',
    enum: scoringFormats,
    nullable: true,
  })
  scoringFormat?: scoringFormats;

  @Column({ type: 'int', nullable: true })
  maxAttempt?: number;

  @Column({ type: 'int', nullable: true })
  timeLimit?: number; // time in minutes

  @Column({ nullable: true })
  currentScore?: number; // can be a decimal

  @Column({ type: 'int' })
  maxScore: number; // should be an integer

  @Column({
    type: 'enum',
    enum: testTypes,
  })
  testType: testTypes;

  @ManyToOne(() => Course, (course) => course.tests)
  course: Course;

  @OneToMany(() => Question, (question) => question.test)
  questions?: Question[];

  @OneToMany(() => Attempt, (attempt) => attempt.test)
  attempts?: Attempt[];
}
