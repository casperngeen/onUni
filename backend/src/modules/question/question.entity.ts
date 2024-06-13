import { Option, OptionResponseDto } from './option.entity';
import { Test } from '../test/test.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  questionId: number;

  @Column('text')
  questionText: string;

  @ManyToOne(() => Test, (test) => test.questions, {
    onDelete: 'CASCADE',
  })
  test: Test;

  @OneToMany(() => Option, (option) => option.question)
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionResponseDto)
  options: OptionResponseDto[];
}

export class UpdateQuestionDto extends QuestionIdDto {
  @IsNotEmpty()
  @IsString()
  questionText: string;
}
