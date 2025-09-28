// server/src/main.ts

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS configuration
  app.enableCors({
    origin: [
      configService.get('FRONTEND_URL'), // http://localhost:3000
      'http://localhost:3000',
      'http://localhost:3001', 
      // Add production URLs here
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger setup for development
  if (configService.get('NODE_ENV') === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Government School Mentoring API')
      .setDescription('API for HEI-Rural School Mentoring Platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get('PORT') || 3001;
  await app.listen(port);
  
  console.log(`🚀 Government School Mentoring API running on: http://localhost:${port}`);
  console.log(`📖 Swagger docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
