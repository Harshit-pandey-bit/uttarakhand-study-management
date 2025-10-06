// src/integrations/whatsapp/whatsapp.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface WhatsAppGroupInfo {
  isValid: boolean;
  webLink: string;
  deepLink: string;
  inviteCode: string;
  joinInstructions: {
    mobile: string[];
    desktop: string[];
  };
}

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Process WhatsApp group link and generate join info
   */
  async processGroupLink(whatsappLink: string): Promise<WhatsAppGroupInfo> {
    try {
      const isValid = this.validateGroupLink(whatsappLink);
      
      if (!isValid) {
        return {
          isValid: false,
          webLink: '',
          deepLink: '',
          inviteCode: '',
          joinInstructions: { mobile: [], desktop: [] },
        };
      }

      const inviteCode = this.extractInviteCode(whatsappLink);
      const deepLink = this.generateDeepLink(whatsappLink);
      const joinInstructions = this.generateJoinInstructions();

      this.logger.log(`Processed WhatsApp group link with invite code: ${inviteCode}`);
      
      return {
        isValid: true,
        webLink: whatsappLink,
        deepLink,
        inviteCode,
        joinInstructions,
      };
    } catch (error) {
      this.logger.error('Failed to process WhatsApp group link:', error);
      return {
        isValid: false,
        webLink: whatsappLink,
        deepLink: whatsappLink,
        inviteCode: '',
        joinInstructions: { mobile: [], desktop: [] },
      };
    }
  }

  /**
   * Validate WhatsApp group link format
   */
  validateGroupLink(link: string): boolean {
    if (!link || typeof link !== 'string') return false;
    
    const whatsappGroupRegex = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+$/;
    return whatsappGroupRegex.test(link.trim());
  }

  /**
   * Extract invite code from WhatsApp link
   */
  extractInviteCode(whatsappLink: string): string {
    const match = whatsappLink.match(/https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9]+)/);
    return match ? match[1] : '';
  }

  /**
   * Generate deep link for mobile apps
   */
  generateDeepLink(whatsappLink: string): string {
    try {
      const inviteCode = this.extractInviteCode(whatsappLink);
      return `whatsapp://chat?code=${inviteCode}`;
    } catch (error) {
      this.logger.error('Failed to generate deep link:', error);
      return whatsappLink; // Fallback to web link
    }
  }

  /**
   * Generate step-by-step join instructions
   */
  generateJoinInstructions(): {
    mobile: string[];
    desktop: string[];
  } {
    return {
      mobile: [
        '📱 Tap the "Join on Mobile" button below',
        '⚡ WhatsApp will open automatically',
        '✅ Tap "Join Group" when prompted',
        '💬 Start participating in discussions!',
      ],
      desktop: [
        '💻 Click the "Open WhatsApp Web" link',
        '📱 Scan QR code with your phone\'s WhatsApp',
        '✅ Click "Join Group" in the web interface',
        '💬 Continue chatting on web or mobile',
      ],
    };
  }

  /**
   * Get system information for users
   */
  getSystemInfo(): {
    features: string[];
    limitations: string[];
    benefits: string[];
  } {
    return {
      features: [
        '🔗 Direct WhatsApp group links (no QR codes needed)',
        '💬 Text-only real-time chat system',
        '📹 Google Meet integration for video sessions',
        '🤖 Automatic session scheduling',
        '📱 Mobile and desktop support',
      ],
      limitations: [
        '📁 No file uploads in chat (keeps system fast)',
        '📷 No QR code generation (direct links only)',
        '💾 Local storage with 30-day auto-cleanup',
      ],
      benefits: [
        '⚡ Lightning fast performance',
        '💰 Zero cloud storage costs',
        '🔒 Better privacy (files stored locally)',
        '🚀 No external dependencies',
        '🛠️ Easy to maintain and deploy',
      ],
    };
  }

  /**
   * Generate shareable group information
   */
  generateShareableInfo(groupName: string, subject: string, whatsappLink: string): {
    message: string;
    webLink: string;
    deepLink: string;
  } {
    const deepLink = this.generateDeepLink(whatsappLink);
    
    const message = `🎓 Join our ${subject} study group: "${groupName}"

📚 Get help with assignments and homework
👥 Connect with classmates and mentors  
🎯 Access study materials and resources
💬 Ask questions and get quick answers

🔗 Join Link: ${whatsappLink}
📱 Mobile: ${deepLink}

Happy studying! 📖✨`;

    return {
      message,
      webLink: whatsappLink,
      deepLink,
    };
  }
}
