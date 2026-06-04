// server/src/assignments/__tests__/upload-security.spec.ts
//
// Phase 6 — Unit tests for file upload security utilities.
// Run:  npx jest src/assignments/__tests__/upload-security.spec.ts --verbose

import {
  sanitizeFilename,
  validateFileMimeAndExt,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from '../upload-security';

// ═══════════════════════════════════════════════════════════════════
//  sanitizeFilename()
// ═══════════════════════════════════════════════════════════════════

describe('sanitizeFilename', () => {
  // ── Basic sanitization ─────────────────────────────────────────
  it('should keep a normal filename unchanged', () => {
    expect(sanitizeFilename('homework.pdf')).toBe('homework.pdf');
  });

  it('should keep underscores, hyphens, and dots', () => {
    expect(sanitizeFilename('my-file_v2.pdf')).toBe('my-file_v2.pdf');
  });

  // ── Directory traversal attacks ────────────────────────────────
  it('should strip ../ traversal sequences', () => {
    const result = sanitizeFilename('../../etc/passwd');
    expect(result).not.toContain('..');
    expect(result).not.toContain('/');
  });

  it('should strip ..\\ Windows traversal sequences', () => {
    const result = sanitizeFilename('..\\..\\windows\\system32\\config');
    expect(result).not.toContain('..');
    expect(result).not.toContain('\\');
  });

  it('should extract only the basename from a full path', () => {
    const result = sanitizeFilename('/home/attacker/uploads/../../etc/shadow');
    expect(result).not.toContain('/');
    expect(result).not.toContain('etc');
    // basename should isolate 'shadow'
    expect(result).toBe('shadow');
  });

  it('should extract basename from a Windows path', () => {
    const result = sanitizeFilename('C:\\Users\\attacker\\malware.exe');
    expect(result).toBe('malware.exe');
  });

  // ── Null bytes and control characters ──────────────────────────
  it('should strip null bytes', () => {
    const result = sanitizeFilename('file\x00.pdf');
    expect(result).not.toContain('\x00');
    expect(result).toBe('file.pdf');
  });

  it('should strip control characters', () => {
    const result = sanitizeFilename('file\x01\x02\x1f.pdf');
    expect(result).not.toMatch(/[\x00-\x1f]/);
  });

  // ── Special characters ─────────────────────────────────────────
  it('should replace spaces and special chars with underscores', () => {
    const result = sanitizeFilename('my homework (final).pdf');
    expect(result).not.toContain(' ');
    expect(result).not.toContain('(');
    expect(result).not.toContain(')');
    expect(result).toMatch(/\.pdf$/);
  });

  it('should collapse multiple underscores into one', () => {
    const result = sanitizeFilename('a___b___c.pdf');
    expect(result).toBe('a_b_c.pdf');
  });

  // ── Edge cases ─────────────────────────────────────────────────
  it('should return "unnamed_file" for empty string', () => {
    expect(sanitizeFilename('')).toBe('unnamed_file');
  });

  it('should return "unnamed_file" for null/undefined', () => {
    expect(sanitizeFilename(null as any)).toBe('unnamed_file');
    expect(sanitizeFilename(undefined as any)).toBe('unnamed_file');
  });

  it('should truncate very long filenames to 200 chars', () => {
    const longName = 'a'.repeat(300) + '.pdf';
    const result = sanitizeFilename(longName);
    expect(result.length).toBeLessThanOrEqual(200);
    expect(result).toMatch(/\.pdf$/);
  });
});

// ═══════════════════════════════════════════════════════════════════
//  validateFileMimeAndExt()
// ═══════════════════════════════════════════════════════════════════

describe('validateFileMimeAndExt', () => {
  // ── Valid combinations ─────────────────────────────────────────
  it('should accept application/pdf + .pdf', () => {
    expect(validateFileMimeAndExt('application/pdf', 'homework.pdf')).toBeNull();
  });

  it('should accept image/jpeg + .jpg', () => {
    expect(validateFileMimeAndExt('image/jpeg', 'photo.jpg')).toBeNull();
  });

  it('should accept image/jpeg + .jpeg', () => {
    expect(validateFileMimeAndExt('image/jpeg', 'photo.jpeg')).toBeNull();
  });

  it('should accept image/png + .png', () => {
    expect(validateFileMimeAndExt('image/png', 'screenshot.png')).toBeNull();
  });

  it('should accept image/webp + .webp', () => {
    expect(validateFileMimeAndExt('image/webp', 'image.webp')).toBeNull();
  });

  // ── Disallowed extensions ──────────────────────────────────────
  it('should reject .exe extension', () => {
    const err = validateFileMimeAndExt('application/octet-stream', 'virus.exe');
    expect(err).toBeTruthy();
    expect(err).toContain('.exe');
  });

  it('should reject .sh extension', () => {
    const err = validateFileMimeAndExt('text/x-shellscript', 'script.sh');
    expect(err).toBeTruthy();
  });

  it('should reject .html extension', () => {
    const err = validateFileMimeAndExt('text/html', 'page.html');
    expect(err).toBeTruthy();
  });

  // ── Disallowed MIME types ──────────────────────────────────────
  it('should reject application/javascript MIME type', () => {
    const err = validateFileMimeAndExt('application/javascript', 'script.pdf');
    expect(err).toBeTruthy();
    expect(err).toContain('MIME type');
  });

  // ── MIME / extension mismatch (spoofing detection) ─────────────
  it('should reject .pdf extension with image/jpeg MIME type', () => {
    const err = validateFileMimeAndExt('image/jpeg', 'fake.pdf');
    expect(err).toBeTruthy();
    expect(err).toContain('spoofing');
  });

  it('should reject .png extension with application/pdf MIME type', () => {
    const err = validateFileMimeAndExt('application/pdf', 'fake.png');
    expect(err).toBeTruthy();
    expect(err).toContain('spoofing');
  });
});

// ═══════════════════════════════════════════════════════════════════
//  Constants validation
// ═══════════════════════════════════════════════════════════════════

describe('Upload security constants', () => {
  it('should have a 10 MB file size limit', () => {
    expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
  });

  it('should allow exactly 5 extensions', () => {
    expect(ALLOWED_EXTENSIONS).toHaveLength(5);
    expect([...ALLOWED_EXTENSIONS]).toEqual(
      expect.arrayContaining(['.pdf', '.jpg', '.jpeg', '.png', '.webp']),
    );
  });

  it('should have MIME entries for every allowed extension', () => {
    const allMimeExts = Object.values(ALLOWED_MIME_TYPES).flat();
    for (const ext of ALLOWED_EXTENSIONS) {
      expect(allMimeExts).toContain(ext);
    }
  });
});
