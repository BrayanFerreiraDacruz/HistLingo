import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const isProd = process.env.NODE_ENV === 'production';

  app.enableCors({
    origin: isProd
      ? [process.env.FRONTEND_URL || '*']
      : ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  // Em produção serve o frontend React buildado
  if (isProd) {
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'public'));
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
