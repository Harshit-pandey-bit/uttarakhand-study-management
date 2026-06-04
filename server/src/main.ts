// server/src/main.ts

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  // ── Ensure uploads directory exists at boot ──────────
  const uploadsDir = join(process.cwd(), 'uploads', 'submissions');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
    console.log(`📁 Created uploads directory: ${uploadsDir}`);
  }

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ── Global Validation ─────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── Cookie Parser (reads access_token from httpOnly cookies) ──
  app.use(cookieParser());

  // ── CORS ───────────────────────────────────────────────
  const isProduction = configService.get('NODE_ENV') === 'production';

  app.enableCors({
    origin: isProduction
      ? [
          'https://uttarakhand-gsmp.vercel.app',
          /\.vercel\.app$/,
        ]
      : [
          'http://localhost:3000',
          'http://localhost:3001',
        ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
  });

  // ── Global Prefix ─────────────────────────────────────
  app.setGlobalPrefix('api');

  // ── Swagger (dev only) ────────────────────────────────
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('UK-GSMP API')
      .setDescription('Uttarakhand Government School Mentoring Platform')
      .setVersion('2.0')
      .addCookieAuth('access_token')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // ── Start Server ──────────────────────────────────────
  const port = configService.get('PORT') || 10000;
  await app.listen(port, '0.0.0.0');

  if (!isProduction) {
    console.log(`🚀 UK-GSMP API running on: http://localhost:${port}`);
    console.log(`📖 Swagger docs at: http://localhost:${port}/api/docs`);
  } else {
    console.log(`🚀 API running in production on port ${port}`);
  }
}

bootstrap();
