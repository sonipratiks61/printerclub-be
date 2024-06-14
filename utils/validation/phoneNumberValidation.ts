import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsTenDigitNumber(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isTenDigitNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!/^\d{10}$/.test(value)) {
            return false;
          }
          return true;
        },
      },
    });
  };
}
