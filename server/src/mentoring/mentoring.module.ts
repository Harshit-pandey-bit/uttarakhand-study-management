// server/src/mentoring/mentoring.module.ts

import { Module } from '@nestjs/common';
import { MentoringController } from './mentoring.controller';
import { MentoringService } from './mentoring.service';

@Module({
  controllers: [MentoringController],
  providers: [MentoringService],
})
export class MentoringModule {}
