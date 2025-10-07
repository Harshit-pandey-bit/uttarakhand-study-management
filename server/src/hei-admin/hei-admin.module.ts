// server/src/hei-admin/hei-admin.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HeiAdminController } from './hei-admin.controller';
import { HeiAdminService } from './hei-admin.service';

@Module({
  imports: [ConfigModule],
  controllers: [HeiAdminController],
  providers: [HeiAdminService],
  exports: [HeiAdminService],
})
export class HeiAdminModule {}
