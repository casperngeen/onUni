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
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

enum ScoringFormats {
  AVERAGE = 'average',
  HIGHEST = 'highest',
  LATEST = 'latest',
}

enum TestTypes {
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
    enum: ScoringFormats,
    nullable: true,
  })
  scoringFormat?: ScoringFormats;

  @Column({ type: 'int', nullable: true })
  maxAttempt?: number;

  @Column({ type: 'int', nullable: true })
  timeLimit?: number; // time in minutes

  @Column({ type: 'int' })
  maxScore: number; // should be an integer

  @Column({
    type: 'enum',
    enum: TestTypes,
  })
  testType: TestTypes;

  @ManyToOne(() => Course, (course) => course.tests)
  course: Course;

  @OneToMany(() => Question, (question) => question.test, {
    cascade: true,
  })
  questions: Question[];

  @OneToMany(() => Attempt, (attempt) => attempt.test, {
    cascade: true,
  })
  attempts: Attempt[];
}

export class TestIdDto {
  @IsInt()
  @IsNotEmpty()
  testId: number;
}

export class TestInfoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  deadline?: Date;

  @IsEnum(ScoringFormats)
  scoringFormat?: ScoringFormats;

  @IsInt()
  @IsNotEmpty()
  maxAttempt?: number;

  @IsInt()
  @IsNotEmpty()
  timeLimit?: number; // time in minutes

  @IsInt()
  @IsNotEmpty()
  maxScore: number; // should be an integer

  @IsEnum(TestTypes)
  testType: TestTypes;
}

export class NewTestDto extends TestInfoDto {
  @IsInt()
  @IsNotEmpty()
  courseId: number;
}

export class UpdateTestDto extends TestInfoDto {
  @IsInt()
  @IsNotEmpty()
  testId: number;
}
