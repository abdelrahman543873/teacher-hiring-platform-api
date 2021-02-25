import {
  Injectable,
  ArgumentMetadata,
  PipeTransform,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    // CHECK VALUE ( OBJECT - NOT_EMPTY )
    if (value instanceof Object && this.isEmpty(value)) return value;
    // throw new HttpException('Validation failed: No body submitted', HttpStatus.BAD_REQUEST);

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) return value;
    // CLASS VALIDATION
    const object = plainToClass(metatype, value);

    const errors = await validate(object);

    if (errors.length > 0)
      throw new HttpException(`${this.getErrors(errors)}`, HttpStatus.BAD_REQUEST);

    return value;
  }

  // CHECK METATYPE FUNCTION
  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }

  // FORMAT ERROR FUNCTION
  private formatErrors(error: Record<string, any> = {}) {
    return Object.values(error).join('-');
  }

  private getErrors(errors: any[], messages = []) {
    if (!errors) return messages;
    for (const i of errors) {
      if (i.constraints) {
        messages.push(this.formatErrors(i.constraints));
      }
      if (i.children && i.children.length) {
        return this.getErrors(i.children, messages);
      }
      return messages;
    }
  }

  // CHECK EMPTY OBJECT FUNCTION
  private isEmpty(value: any) {
    if (Object.keys(value).length > 0) return false;
    return true;
  }
}
