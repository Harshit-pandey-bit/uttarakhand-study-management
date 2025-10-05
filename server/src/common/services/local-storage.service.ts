// src/common/services/local-storage.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class LocalStorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly uploadPath: string;
  private readonly tempPath: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadPath = path.join(process.cwd(), 'uploads');
    this.tempPath = path.join(this.uploadPath, 'temp');
    this.baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3000';
    
    this.initializeDirectories();
  }

  private async initializeDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
      await fs.mkdir(this.tempPath, { recursive: true });
      
      // Create .gitignore to ignore uploaded files
      const gitignoreContent = `# Uploaded files\n*\n!.gitignore\n`;
      await fs.writeFile(path.join(this.uploadPath, '.gitignore'), gitignoreContent);
      
      this.logger.log(`Local storage initialized at: ${this.uploadPath}`);
    } catch (error) {
      this.logger.error('Failed to initialize directories:', error);
    }
  }

  /**
   * Store temporary file with 30-day auto cleanup
   */
  async storeTemporaryFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string = 'application/octet-stream'
  ): Promise<{ fileUrl: string; filePath: string; expiresAt: Date }> {
    try {
      const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueName = `${Date.now()}-${sanitizedName}`;
      const filePath = path.join(this.tempPath, uniqueName);
      
      // Write file to temp directory
      await fs.writeFile(filePath, buffer);
      
      // Create metadata file for cleanup tracking
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      const metadataPath = `${filePath}.meta`;
      const metadata = {
        originalName: fileName,
        mimeType,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      };
      
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
      
      const fileUrl = `${this.baseUrl}/uploads/temp/${uniqueName}`;
      
      this.logger.log(`Temporary file stored: ${uniqueName} (expires: ${expiresAt})`);
      return { fileUrl, filePath, expiresAt };
    } catch (error) {
      this.logger.error('Failed to store temporary file:', error);
      throw new Error('File storage failed: ' + error.message);
    }
  }

  /**
   * Get expired files for cleanup
   */
  async getExpiredFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.tempPath);
      const expiredFiles: string[] = [];
      const now = new Date();

      for (const file of files) {
        if (file.endsWith('.meta')) {
          continue; // Skip metadata files in this loop
        }

        const filePath = path.join(this.tempPath, file);
        const metadataPath = `${filePath}.meta`;
        
        try {
          // Check if metadata file exists
          const metadataContent = await fs.readFile(metadataPath, 'utf-8');
          const metadata = JSON.parse(metadataContent);
          
          if (new Date(metadata.expiresAt) < now) {
            expiredFiles.push(filePath);
            expiredFiles.push(metadataPath); // Also delete metadata
          }
        } catch {
          // If no metadata, check file stats as fallback
          const stats = await fs.stat(filePath);
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          
          if (stats.birthtime < thirtyDaysAgo) {
            expiredFiles.push(filePath);
          }
        }
      }

      this.logger.log(`Found ${expiredFiles.length} expired files`);
      return expiredFiles;
    } catch (error) {
      this.logger.error('Failed to get expired files:', error);
      return [];
    }
  }

  /**
   * Clean up expired files
   */
  async cleanupExpiredFiles(): Promise<number> {
    try {
      const expiredFiles = await this.getExpiredFiles();
      
      if (expiredFiles.length === 0) {
        return 0;
      }

      let deletedCount = 0;
      
      for (const filePath of expiredFiles) {
        try {
          await fs.unlink(filePath);
          deletedCount++;
          this.logger.log(`Cleaned up expired file: ${path.basename(filePath)}`);
        } catch (error) {
          this.logger.warn(`Failed to delete file: ${filePath}`);
        }
      }

      this.logger.log(`Cleaned up ${deletedCount} expired files`);
      return deletedCount;
    } catch (error) {
      this.logger.error('Failed to cleanup expired files:', error);
      return 0;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSizeMB: number;
  }> {
    try {
      const files = await fs.readdir(this.tempPath);
      let totalSize = 0;
      let fileCount = 0;

      for (const file of files) {
        if (file.endsWith('.meta')) {
          continue; // Don't count metadata files
        }

        const filePath = path.join(this.tempPath, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
        fileCount++;
      }

      return {
        totalFiles: fileCount,
        totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100,
      };
    } catch (error) {
      this.logger.error('Failed to get storage stats:', error);
      return { totalFiles: 0, totalSizeMB: 0 };
    }
  }
}
