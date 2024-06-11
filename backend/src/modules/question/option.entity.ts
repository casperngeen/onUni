import { IsNotEmpty, IsInt, IsString } from 'class-validator';
import { Question } from '../question/question.entity';
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

export class NewOptionDto {
  @IsNotEmpty()
  @IsInt()
  questionId: number;

  @IsNotEmpty()
  @IsString()
  optionText: string;
}

export class OptionIdDto {
  @IsNotEmpty()
  @IsInt()
  optionId: number;
}

export class UpdateOptionDto extends OptionIdDto {
  @IsNotEmpty()
  @IsString()
  optionText: string;
}
