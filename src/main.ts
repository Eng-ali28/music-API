import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import AppModule from './app.module';
import { join } from 'path';
import appConfig from './config/app.config';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.setGlobalPrefix('/api/v1');
  app.useStaticAssets(join(process.cwd(), 'uploads', 'images'));
  app.useStaticAssets(join(process.cwd(), 'uploads', 'audio'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(appConfig().port);
}
bootstrap();
