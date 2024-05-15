import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';

export const ValidationFunctionPipe = () =>
  new ValidationPipe({
    exceptionFactory: (errors) => {
      const result = {};
      errors.forEach((error) => {
        const { property, constraints } = error;
        const constraintKey = Object.keys(constraints)[0];
        result[property] = `${constraints[constraintKey]}`;
      });
      return new HttpException(
        { result, success: false },
        HttpStatus.BAD_REQUEST,
      );
    },
    stopAtFirstError: true,
    whitelist: true, // Strips non-whitelisted properties
    transform: true,
  });
