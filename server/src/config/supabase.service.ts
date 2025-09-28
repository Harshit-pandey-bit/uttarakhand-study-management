// server/src/config/supabase.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  
  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!, // Use service role for backend
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // For operations that need user context
  getClientWithAuth(accessToken: string): SupabaseClient {
    const client = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_ANON_KEY')!,
    );

    client.auth.setSession({
      access_token: accessToken,
      refresh_token: '',
    });

    return client;
  }
}
