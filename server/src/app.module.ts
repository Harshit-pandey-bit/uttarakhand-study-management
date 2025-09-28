// server/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { AuthModule } from './auth/auth.module';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { AssessmentModule } from './assessment/assessment.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { CareersModule } from './careers/careers.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    StudentsModule,
    AssessmentModule,
    AssignmentsModule,
    CareersModule,
    DashboardModule,
    
    // Feature modules
    //AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
