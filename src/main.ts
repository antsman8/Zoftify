import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { ValidationFailedException } from './exceptions/domain-exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const host = process.env.BACKEND_HOST || '0.0.0.0';
  const port = parseInt(process.env.BACKEND_PORT, 10) || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => {
          const constraints = Object.values(error.constraints || {});
          return `${error.property}: ${constraints.join(', ')}`;
        });
        return new ValidationFailedException(messages);
      },
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(port, host, () =>
    console.log(`Server started on ${host}:${port}`),
  );
}
bootstrap();
