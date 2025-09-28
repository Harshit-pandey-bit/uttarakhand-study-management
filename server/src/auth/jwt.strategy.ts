// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const cookieExtractor = (req: any): string | null => {
  console.log('🍪 Cookie extractor called');
  console.log('🍪 Request cookies:', req?.cookies);
  const token = req?.cookies?.access_token ?? null;
  console.log('🔑 Extracted token:', token ? 'Found' : 'Not found');
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private jwks?: jwksClient.JwksClient;
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKeyProvider: (
        req: any,
        rawJwt: string | undefined,
        done: (err: any, secret?: string | Buffer) => void,
      ) => {
        (async () => {
          try {
            console.log('🔍 secretOrKeyProvider called');
            console.log('🔑 Raw JWT provided:', rawJwt ? 'Yes' : 'No');
            
            if (!rawJwt) {
              console.log('❌ No token provided');
              return done(new UnauthorizedException('No token provided'), undefined);
            }

            const decoded = jwt.decode(rawJwt, { complete: true }) as
              | { header?: Record<string, any> }
              | null;

            if (!decoded || !decoded.header) {
              console.log('❌ Invalid token format');
              return done(new UnauthorizedException('Invalid token format'), undefined);
            }

            const alg = String(decoded.header.alg ?? '').toUpperCase();
            console.log('🔐 Token algorithm:', alg);

            // HS256 - use symmetric secret
            if (alg.startsWith('HS')) {
              console.log('🔐 Using HS256 with secret');
              const secret = this.configService.get<string>('SUPABASE_JWT_SECRET');
              if (!secret) {
                console.log('❌ Missing SUPABASE_JWT_SECRET');
                return done(new UnauthorizedException('Server missing SUPABASE_JWT_SECRET'), undefined);
              }
              console.log('✅ Secret found, length:', secret.length);
              return done(null, secret);
            }

            // RS256 - use JWKS (kid -> public key)
            if (alg.startsWith('RS')) {
              console.log('🔐 Using RS256 with JWKS');
              const projectRef = this.configService.get<string>('SUPABASE_PROJECT_REF');
              if (!projectRef) {
                console.log('❌ Missing SUPABASE_PROJECT_REF');
                return done(new UnauthorizedException('Missing SUPABASE_PROJECT_REF'), undefined);
              }

              if (!this.jwks) {
                const jwksUri = `https://${projectRef}.supabase.co/auth/v1/keys`;
                console.log('🔗 Creating JWKS client for:', jwksUri);
                this.jwks = jwksClient({ jwksUri, cache: true, rateLimit: true });
              }

              const kid = decoded.header.kid;
              if (!kid) {
                console.log('❌ Token missing kid header');
                return done(new UnauthorizedException('Token missing kid header'), undefined);
              }

              console.log('🔑 Getting signing key for kid:', kid);
              this.jwks.getSigningKey(kid, (err, key: any) => {
                if (err) {
                  console.log('❌ JWKS error:', err);
                  return done(err, undefined);
                }
                try {
                  const pub = key.getPublicKey();
                  console.log('✅ Public key retrieved');
                  return done(null, pub);
                } catch (e) {
                  console.log('❌ Error getting public key:', e);
                  return done(e, undefined);
                }
              });

              return;
            }

            console.log('❌ Unsupported algorithm:', alg);
            return done(new UnauthorizedException('Unsupported token algorithm'), undefined);
          } catch (err) {
            console.log('❌ secretOrKeyProvider error:', err);
            return done(err, undefined);
          }
        })();
      },
      algorithms: ['RS256', 'HS256'],
    });

    // Initialize Supabase client for database queries
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!
    );
  }

  async validate(payload: any) {
    console.log('✅ JWT validate called with payload:', {
      sub: payload?.sub,
      email: payload?.email,
      exp: payload?.exp
    });
    
    if (!payload?.sub) {
      console.log('❌ No sub in payload');
      throw new UnauthorizedException();
    }

    try {
      // Query our custom app_users table to get user data
      console.log('🔍 Querying app_users table for user:', payload.sub);
      const { data: user, error } = await this.supabase
        .from('app_users')
        .select('id, email, role')
        .eq('id', payload.sub)
        .single();

      if (error) {
        console.log('❌ Database error:', error.message);
        throw new UnauthorizedException('Database query failed');
      }

      if (!user) {
        console.log('❌ User not found in app_users table');
        throw new UnauthorizedException('User not found in application database');
      }

      console.log('✅ Validation successful for user:', user.email, 'with role:', user.role);
      
      // Return clean user object that will be attached to req.user
      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.log('❌ Unexpected error during validation:', error);
      throw new UnauthorizedException('Authentication validation failed');
    }
  }
}
