// server/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AssessmentModule } from './assessment/assessment.module';
import { MentoringModule } from './mentoring/mentoring.module';
import { AssignmentsModule } from './assignments/assignments.module';

@Module({
  imports: [
    // Global configuration from .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (Supabase JS client)
    SupabaseModule,

    // Authentication (cookie-based, dual-algorithm JWT)
    AuthModule,

    // Feature modules
    AssessmentModule,
    MentoringModule,
    AssignmentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
