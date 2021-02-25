import { registerDecorator, ValidationOptions } from 'class-validator';
import { CitiesEnum } from '../../user/user.enum';
import { BaseHttpException } from '../exceptions/base-http-exception';

async function mustBeCity(value: string) {
  if (!(value.toUpperCase() in CitiesEnum)) {
    throw new BaseHttpException('EN', 647);
  }
  return true;
}

export function IsCity(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsCity',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any) {
          return await mustBeCity(value);
        }
      }
    });
  };
}
