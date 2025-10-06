// src/common/cron/cleanup.cron.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class CleanupCronService {
  private readonly logger = new Logger(CleanupCronService.name);
  private isCleanupRunning = false;

  constructor(private localStorageService: LocalStorageService) {}

  /**
   * Daily cleanup of expired files at 2 AM IST
   */
  @Cron('0 2 * * *', {
    timeZone: 'Asia/Kolkata'
  })
  async handleDailyCleanup(): Promise<void> {
    if (this.isCleanupRunning) {
      this.logger.warn('Daily cleanup already running, skipping...');
      return;
    }

    this.isCleanupRunning = true;
    this.logger.log('🧹 Starting daily cleanup of expired files');
    
    try {
      const deletedCount = await this.localStorageService.cleanupExpiredFiles();
      
      if (deletedCount > 0) {
        this.logger.log(`✅ Daily cleanup completed: ${deletedCount} files removed`);
      } else {
        this.logger.log('✅ Daily cleanup completed: No expired files found');
      }

      // Get stats after cleanup
      const stats = await this.localStorageService.getStorageStats();
      this.logger.log(`📊 Storage stats: ${stats.totalFiles} files, ${stats.totalSizeMB} MB used`);
    } catch (error) {
      this.logger.error('❌ Daily cleanup failed:', error);
    } finally {
      this.isCleanupRunning = false;
    }
  }

  /**
   * Weekly storage report (Sundays at 6 AM IST)
   */
  @Cron('0 6 * * 0', {
    timeZone: 'Asia/Kolkata'
  })
  async handleWeeklyReport(): Promise<void> {
    this.logger.log('📊 Generating weekly storage report');
    
    try {
      const stats = await this.localStorageService.getStorageStats();
      
      this.logger.log(`
╔══════════════════════════════════════╗
║          📊 WEEKLY REPORT            ║
╠══════════════════════════════════════╣
║ 📁 Total files: ${stats.totalFiles.toString().padStart(18)} ║
║ 💾 Storage used: ${stats.totalSizeMB.toString().padStart(13)} MB ║
║ 🗓️  Report date: ${new Date().toLocaleDateString('en-IN').padStart(14)} ║
║ ⏰ Report time: ${new Date().toLocaleTimeString('en-IN').padStart(15)} ║
╚══════════════════════════════════════╝
      `);
    } catch (error) {
      this.logger.error('❌ Weekly report generation failed:', error);
    }
  }

  /**
   * Manual cleanup trigger for testing
   */
  async triggerManualCleanup(): Promise<{ 
    success: boolean; 
    deletedCount: number; 
    message: string;
    stats: { totalFiles: number; totalSizeMB: number };
  }> {
    if (this.isCleanupRunning) {
      return {
        success: false,
        deletedCount: 0,
        message: 'Cleanup already running',
        stats: { totalFiles: 0, totalSizeMB: 0 },
      };
    }

    this.isCleanupRunning = true;
    
    try {
      this.logger.log('🧹 Manual cleanup triggered');
      const deletedCount = await this.localStorageService.cleanupExpiredFiles();
      const stats = await this.localStorageService.getStorageStats();
      
      this.logger.log(`✅ Manual cleanup completed: ${deletedCount} files deleted`);
      return {
        success: true,
        deletedCount,
        message: `Successfully cleaned up ${deletedCount} expired files`,
        stats,
      };
    } catch (error) {
      this.logger.error('❌ Manual cleanup failed:', error);
      return {
        success: false,
        deletedCount: 0,
        message: `Cleanup failed: ${error.message}`,
        stats: { totalFiles: 0, totalSizeMB: 0 },
      };
    } finally {
      this.isCleanupRunning = false;
    }
  }
}
