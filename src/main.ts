import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const host = process.env.BACKEND_HOST || '0.0.0.0';
  const port = parseInt(process.env.BACKEND_PORT, 10) || 3000;

  app.setGlobalPrefix('api');


  await app.listen(port, host, () =>
    console.log(`Server started on ${host}:${port}`),
  );
}
bootstrap();
