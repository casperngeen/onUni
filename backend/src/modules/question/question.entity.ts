import { Option } from './option.entity';
import { Test } from '../test/test.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  questionId: number;

  @Column('text')
  questionText: string;

  @ManyToOne(() => Test, (test) => test.questions)
  test: Test;

  @OneToMany(() => Option, (option) => option.question, {
    cascade: true,
  })
  options: Option[];
}

export class NewQuestionDto {
  @IsNotEmpty()
  @IsInt()
  testId: number;

  @IsNotEmpty()
  @IsString()
  questionText: string;
}

export class QuestionIdDto {
  @IsNotEmpty()
  @IsInt()
  questionId: number;
}

export class QuestionInfoDto {
  @IsNotEmpty()
  @IsInt()
  questionId: number;

  @IsNotEmpty()
  @IsString()
  questionText: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  options: string[];
}

export class UpdateQuestionDto extends QuestionIdDto {
  @IsNotEmpty()
  @IsString()
  questionText: string;
}
