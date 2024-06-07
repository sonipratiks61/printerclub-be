import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getCustomValidationError } from 'utils/validation/validationFunction';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: '*', // Allows all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    allowedHeaders: '*', // Custom headers you wish to allow
    credentials: true, // Supports credentials like cookies
  });

  const options = new DocumentBuilder()
    .setTitle('Example API')
    .setDescription('The example API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) =>
        new HttpException(
          getCustomValidationError(errors), // Call getCustomValidationError to format the error
          HttpStatus.BAD_REQUEST, // Set the HTTP status to 400 Bad Request
        ),
      transform: true,
      stopAtFirstError: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
