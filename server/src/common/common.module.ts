// src/common/common.module.ts

import { Module } from '@nestjs/common';
import { SystemController } from './controllers/system.controller';

@Module({
  controllers: [SystemController],
})
export class CommonModule {}
