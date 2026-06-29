import * as dotenv from 'dotenv';
import * as path from 'path';
// Carrega .env relativo ao dist/ — funciona independente do CWD do PM2
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const isProd = process.env.NODE_ENV === 'production';

  app.enableCors({
    origin: isProd
      ? process.env.FRONTEND_URL || '*'
      : ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  if (isProd) {
    const publicPath = join(__dirname, '..', 'public');
    // Serve static assets (JS, CSS, images) from the public directory
    app.useStaticAssets(publicPath);
    // SPA fallback: serve index.html for all non-API routes
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(join(publicPath, 'index.html'));
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
