import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import PhoneNumber from 'awesome-phonenumber';

async function mustBeLandLineNumber(value: string, landLineNumber: string) {
  return new PhoneNumber(value, landLineNumber).isFixedLine();
}

export function IsLandLineNumber(region: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsLandLineNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [region],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const [region] = args.constraints;
          return await mustBeLandLineNumber(value, region);
        }
      }
    });
  };
}
