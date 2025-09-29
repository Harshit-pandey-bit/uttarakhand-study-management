// server/src/assignments/assignments.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 5, // Max 5 files per upload
      },
    }),
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
