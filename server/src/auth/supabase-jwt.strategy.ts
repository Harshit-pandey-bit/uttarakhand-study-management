// server/src/auth/supabase-jwt.strategy.ts
//
// Passport strategy for Supabase JWT verification:
//   1. Extracts `access_token` from an HTTP-only cookie (NOT Bearer header).
//   2. Uses JWKS endpoint to dynamically fetch the correct ES256 public key.
//   3. Supports ES256 (Supabase's default), RS256, and HS256.

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import * as jwksRsa from 'jwks-rsa';

/** Payload shape embedded in every Supabase JWT */
export interface SupabaseJwtPayload {
  sub: string;          // auth.users UUID
  email?: string;
  role?: string;        // 'authenticated' | 'anon'
  user_metadata?: {
    role?: string;      // our custom user_role enum value
    [key: string]: any;
  };
  app_metadata?: Record<string, any>;
  aud?: string;
  iss?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(Strategy, 'supabase-jwt') {
  private readonly logger = new Logger(SupabaseJwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    const projectRef = configService.get<string>('SUPABASE_PROJECT_REF');
    const anonKey = configService.get<string>('SUPABASE_ANON_KEY');

    if (!projectRef || !anonKey) {
      throw new Error(
        'Missing SUPABASE_PROJECT_REF or SUPABASE_ANON_KEY in environment',
      );
    }

    const jwksUri = `https://${projectRef}.supabase.co/auth/v1/.well-known/jwks.json`;

    // Use secretOrKeyProvider with JWKS to dynamically fetch the ES256 public key
    super({
      jwtFromRequest: (req: Request) => {
        return req?.cookies?.['access_token'] ?? null;
      },
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        jwksUri,
        cache: true,
        cacheMaxAge: 600_000, // 10 minutes
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        // Supabase requires the apikey header to access the JWKS endpoint
        requestHeaders: {
          apikey: anonKey,
        },
      }),
      algorithms: ['ES256', 'RS256', 'HS256'],
      ignoreExpiration: false,
    });

    this.logger.log(`JWT strategy configured with JWKS from ${jwksUri}`);
  }

  /**
   * Called by Passport after the token has been verified.
   * Returns the payload which becomes `req.user`.
   */
  async validate(payload: SupabaseJwtPayload): Promise<SupabaseJwtPayload> {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    this.logger.debug(`Authenticated user: ${payload.sub} (${payload.email})`);
    return payload;
  }
}
