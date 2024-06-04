import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { InvalidInputException } from 'src/exceptions/invalid.input.exception';

// should i make my own????
@Injectable()
export class BaseValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new InvalidInputException();
    }
    return value;
  }

  private toValidate(metatype: unknown): boolean {
    type PrimitiveConstructor =
      | StringConstructor
      | BooleanConstructor
      | NumberConstructor
      | ArrayConstructor
      | ObjectConstructor;
    const types: PrimitiveConstructor[] = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype as PrimitiveConstructor);
  }
}
