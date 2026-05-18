/* eslint-disable import/first, import/order */
import * as dotenv from 'dotenv';
// Override shell env vars with values from .env (must run before AppModule import)
dotenv.config({ override: true });
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? 'http://localhost:3000',
    credentials: true,
  });

  //   thís code use for network mobile
  //   const corsOrigins = process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()) ?? [
  //   'http://localhost:3000',
  // ];
  // app.enableCors({
  //   origin: corsOrigins,
  //   credentials: true,
  // });

  app.setGlobalPrefix('api');

  const port = parseInt(process.env.PORT || '4000', 10);
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
  console.log(`Cloudinary cloud: ${process.env.CLOUDINARY_CLOUD_NAME || '(none)'}`);
}

bootstrap();
