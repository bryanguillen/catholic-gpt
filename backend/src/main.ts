import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(configService.get('cors'));

  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 20,
    }),
  );

  await app.listen(3000);
}
bootstrap();
