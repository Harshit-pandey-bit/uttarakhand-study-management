// server/src/main.ts

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.use(cookieParser());

  // CORS configuration - FIXED for production
  const isProduction = configService.get('NODE_ENV') === 'production';
  
  app.enableCors({
    origin: isProduction 
      ? [
          'https://uttarakhand-gsmp.vercel.app', // ✅ Your production URL
          /\.vercel\.app$/, // ✅ Fixed regex - allows all Vercel preview deployments
        ]
      : [
          'http://localhost:3000',
          'http://localhost:3001',
        ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true, // ✅ Critical for cookie-based auth
    exposedHeaders: ['Set-Cookie'], // ✅ Allow Set-Cookie header to be read
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger setup for development only
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Government School Mentoring API')
      .setDescription('API for HEI-Rural School Mentoring Platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // CRITICAL: Bind to 0.0.0.0 and use PORT from environment
  const port = configService.get('PORT') || 10000;
  await app.listen(port, '0.0.0.0');

  if (!isProduction) {
    console.log(`🚀 Government School Mentoring API running on: http://localhost:${port}`);
    console.log(`📖 Swagger docs available at: http://localhost:${port}/api/docs`);
  } else {
    console.log(`🚀 API running in production on port ${port}`);
    console.log(`🌐 CORS enabled for: https://uttarakhand-gsmp.vercel.app`);
  }
}

bootstrap();
