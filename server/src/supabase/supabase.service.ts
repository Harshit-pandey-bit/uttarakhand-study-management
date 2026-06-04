// server/src/supabase/supabase.service.ts
//
// Global Supabase client for server-side database operations.
// Uses the SERVICE_ROLE_KEY to bypass Row Level Security (RLS)
// since auth is already handled by JWT guards in NestJS.

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private _client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables',
      );
    }

    this._client = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /** Access the Supabase client instance for database queries */
  get client(): SupabaseClient {
    return this._client;
  }

  async onModuleInit() {
    // Quick health check — try to reach the database
    const { error } = await this._client.from('schools').select('id').limit(1);
    if (error) {
      this.logger.warn(
        `Supabase connection check returned an error: ${error.message}. ` +
        `This may be expected if the table has RLS or is empty.`,
      );
    } else {
      this.logger.log('Connected to Supabase successfully');
    }
  }
}
