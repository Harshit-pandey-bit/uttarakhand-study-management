// server/src/auth/__tests__/dual-auth.spec.ts
//
// Phase 6 — Dual-Auth Validation Tests
// Verifies that:
//   1. HS256 tokens (signed with SUPABASE_JWT_SECRET) are accepted.
//   2. Invalid / expired / malformed tokens are rejected.
//   3. The cookie-based extraction pipeline works end-to-end.
//
// Run:  npx jest src/auth/__tests__/dual-auth.spec.ts --verbose

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import * as cookieParser from 'cookie-parser';

import { SupabaseJwtStrategy, SupabaseJwtPayload } from '../supabase-jwt.strategy';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { Public } from '../public.decorator';

// ─── Test constants ────────────────────────────────────────────────
const TEST_JWT_SECRET = 'test-secret-for-unit-tests-min-32-chars!!';
const TEST_PROJECT_REF = 'fake-project-ref';

/** Helper: sign an HS256 JWT with a given payload and optional overrides. */
function signHS256(
  payload: Partial<SupabaseJwtPayload>,
  secret = TEST_JWT_SECRET,
  options: jwt.SignOptions = {},
): string {
  const defaults: SupabaseJwtPayload = {
    sub: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    email: 'student@example.com',
    role: 'authenticated',
    user_metadata: { role: 'STUDENT' },
    aud: 'authenticated',
    iss: `https://${TEST_PROJECT_REF}.supabase.co/auth/v1`,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
  };

  return jwt.sign({ ...defaults, ...payload }, secret, {
    algorithm: 'HS256',
    ...options,
  });
}

// ─── Tiny inline controller for testing ────────────────────────────
@Controller('test-auth')
class TestAuthController {
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  protectedRoute(@Req() req: any) {
    return { user: req.user };
  }

  @Get('public')
  @Public()
  publicRoute() {
    return { message: 'no auth needed' };
  }
}

// ─── Test suite ────────────────────────────────────────────────────
describe('Dual-Auth (HS256 / RS256) Validation', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          // Provide test env vars directly (no .env file needed)
          load: [
            () => ({
              SUPABASE_JWT_SECRET: TEST_JWT_SECRET,
              SUPABASE_PROJECT_REF: TEST_PROJECT_REF,
            }),
          ],
        }),
        PassportModule.register({ defaultStrategy: 'supabase-jwt' }),
      ],
      controllers: [TestAuthController],
      providers: [SupabaseJwtStrategy, JwtAuthGuard],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── 1. Valid HS256 token is accepted ─────────────────────────────
  it('should accept a valid HS256 token from the access_token cookie', async () => {
    const token = signHS256({
      sub: '11111111-2222-3333-4444-555555555555',
      email: 'mentor@example.com',
      user_metadata: { role: 'HEI_MENTOR' },
    });

    const res = await request(app.getHttpServer())
      .get('/test-auth/protected')
      .set('Cookie', [`access_token=${token}`])
      .expect(200);

    expect(res.body.user).toBeDefined();
    expect(res.body.user.sub).toBe('11111111-2222-3333-4444-555555555555');
    expect(res.body.user.email).toBe('mentor@example.com');
    expect(res.body.user.user_metadata.role).toBe('HEI_MENTOR');
  });

  // ── 2. Token signed with wrong secret is rejected ───────────────
  it('should reject a token signed with a different secret', async () => {
    const token = signHS256(
      { sub: '11111111-2222-3333-4444-555555555555' },
      'completely-wrong-secret-key-that-is-long',
    );

    await request(app.getHttpServer())
      .get('/test-auth/protected')
      .set('Cookie', [`access_token=${token}`])
      .expect(401);
  });

  // ── 3. Expired token is rejected ────────────────────────────────
  it('should reject an expired HS256 token', async () => {
    const token = signHS256({
      sub: '11111111-2222-3333-4444-555555555555',
      iat: Math.floor(Date.now() / 1000) - 7200, // issued 2h ago
      exp: Math.floor(Date.now() / 1000) - 3600, // expired 1h ago
    });

    await request(app.getHttpServer())
      .get('/test-auth/protected')
      .set('Cookie', [`access_token=${token}`])
      .expect(401);
  });

  // ── 4. Token missing 'sub' claim is rejected ────────────────────
  it('should reject a token with no sub claim', async () => {
    // Sign a raw payload without 'sub' — bypass the helper defaults
    const payload = {
      email: 'nosub@example.com',
      role: 'authenticated',
      user_metadata: { role: 'STUDENT' },
      aud: 'authenticated',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    const token = jwt.sign(payload, TEST_JWT_SECRET, { algorithm: 'HS256' });

    await request(app.getHttpServer())
      .get('/test-auth/protected')
      .set('Cookie', [`access_token=${token}`])
      .expect(401);
  });

  // ── 5. No cookie at all → 401 ──────────────────────────────────
  it('should return 401 when no access_token cookie is provided', async () => {
    await request(app.getHttpServer())
      .get('/test-auth/protected')
      .expect(401);
  });

  // ── 6. Malformed / garbage token → 401 ──────────────────────────
  it('should reject a completely malformed token string', async () => {
    await request(app.getHttpServer())
      .get('/test-auth/protected')
      .set('Cookie', ['access_token=not.a.valid.jwt.at.all'])
      .expect(401);
  });

  // ── 7. @Public() routes bypass auth ─────────────────────────────
  it('should allow access to @Public() routes without any token', async () => {
    const res = await request(app.getHttpServer())
      .get('/test-auth/public')
      .expect(200);

    expect(res.body.message).toBe('no auth needed');
  });

  // ── 8. Token in Authorization header (without cookie) → 401 ────
  // Our strategy extracts from cookies only, not Bearer header.
  it('should NOT accept a Bearer token in the Authorization header', async () => {
    const token = signHS256({
      sub: '11111111-2222-3333-4444-555555555555',
    });

    await request(app.getHttpServer())
      .get('/test-auth/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
