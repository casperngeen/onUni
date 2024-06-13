import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Question } from '../question/question.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Type } from 'class-transformer';

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

export class OptionInfoDto {
  @IsNotEmpty()
  @IsString()
  optionText: string;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;
}

export class OptionIdDto {
  @IsNotEmpty()
  @IsInt()
  optionId: number;
}

export class UpdateOptionDto extends OptionInfoDto {
  @IsNotEmpty()
  @IsInt()
  optionId: number;
}

export class NewOptionDto {
  @IsNotEmpty()
  @IsInt()
  questionId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionInfoDto)
  optionInfos: OptionInfoDto[];
}

export class OptionResponseDto {
  @IsNotEmpty()
  @IsString()
  optionText: string;

  @IsNotEmpty()
  @IsInt()
  optionId: number;
}
