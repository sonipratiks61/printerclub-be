import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationFunctionPipe } from 'utils/validationFunction';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(ValidationFunctionPipe());
  await app.listen(3000);
}
bootstrap();
