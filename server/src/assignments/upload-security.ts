// server/src/assignments/upload-security.ts
//
// Phase 6 — Centralized file-upload security utilities.
//
// Provides:
//   1. Filename sanitization (prevents directory traversal + control chars)
//   2. MIME-type allowlisting (checks actual Content-Type header, not just extension)
//   3. Reusable Multer config factory

import { BadRequestException } from '@nestjs/common';
import { diskStorage, Options } from 'multer';
import { extname, join, basename } from 'path';
import { existsSync, mkdirSync } from 'fs';

// ── Allowed file types ─────────────────────────────────────────────
// We check BOTH the extension AND the MIME type to prevent spoofing.

export const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'] as const;

/**
 * Map of allowed MIME types → extensions.
 * We validate the incoming Content-Type header against this.
 */
export const ALLOWED_MIME_TYPES: Record<string, readonly string[]> = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

/** Maximum file size: 10 MB */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ── Filename sanitization ──────────────────────────────────────────

/**
 * Sanitize a user-supplied filename to prevent directory traversal
 * and other injection attacks.
 *
 * Rules:
 *   1. Extract only the basename (strip any path separators).
 *   2. Remove null bytes and control characters.
 *   3. Replace path traversal sequences (../ or ..\\).
 *   4. Replace runs of non-alphanumeric chars (except . - _) with underscores.
 *   5. Limit total length to 200 chars.
 *   6. If nothing remains, use 'unnamed_file'.
 */
export function sanitizeFilename(original: string): string {
  if (!original || typeof original !== 'string') {
    return 'unnamed_file';
  }

  let name = original;

  // 1. Strip to basename only (handles both Unix and Windows separators)
  name = basename(name.replace(/\\/g, '/'));

  // 2. Remove null bytes and C0 control characters (U+0000–U+001F)
  name = name.replace(/[\x00-\x1f]/g, '');

  // 3. Remove directory traversal sequences
  name = name.replace(/\.\.\//g, '').replace(/\.\.\\/g, '');

  // 4. Collapse non-safe characters into underscores
  //    Keep: alphanumeric, dot, hyphen, underscore
  name = name.replace(/[^a-zA-Z0-9.\-_]/g, '_');

  // 5. Collapse multiple consecutive underscores / dots
  name = name.replace(/_+/g, '_').replace(/\.+/g, '.');

  // 6. Trim leading/trailing underscores and dots (but keep the extension dot)
  name = name.replace(/^[_.]+/, '').replace(/[_]+$/, '');

  // 7. Length limit
  if (name.length > 200) {
    const ext = extname(name);
    name = name.substring(0, 200 - ext.length) + ext;
  }

  return name || 'unnamed_file';
}

// ── MIME-type validation ───────────────────────────────────────────

/**
 * Validate that a file's MIME type AND extension are both in the allowlist,
 * and that they're consistent with each other.
 *
 * @returns null if valid; error message if invalid.
 */
export function validateFileMimeAndExt(
  mimeType: string,
  originalName: string,
): string | null {
  const ext = extname(originalName).toLowerCase();

  // Check extension
  if (!ALLOWED_EXTENSIONS.includes(ext as any)) {
    return `File extension "${ext}" is not allowed. Accepted: ${ALLOWED_EXTENSIONS.join(', ')}`;
  }

  // Check MIME type
  const allowedExtsForMime = ALLOWED_MIME_TYPES[mimeType];
  if (!allowedExtsForMime) {
    return `MIME type "${mimeType}" is not allowed. Accepted: ${Object.keys(ALLOWED_MIME_TYPES).join(', ')}`;
  }

  // Cross-check: does the MIME type match the extension?
  if (!allowedExtsForMime.includes(ext)) {
    return `MIME type "${mimeType}" does not match file extension "${ext}". Possible spoofing attempt.`;
  }

  return null; // valid
}

// ── Multer config factory ──────────────────────────────────────────

/**
 * Creates a secure Multer configuration for student submissions.
 * Includes: filename sanitization, MIME-type + extension validation,
 * file-size limits, and per-student directory isolation.
 */
export function createSecureUploadOptions(): Options {
  return {
    storage: diskStorage({
      destination: (req: any, _file, cb) => {
        const studentId = req.user?.sub ?? 'unknown';

        // Sanitize the studentId just in case (should be a UUID from JWT)
        const safeStudentId = studentId.replace(/[^a-zA-Z0-9\-]/g, '_');

        const uploadDir = join(
          process.cwd(),
          'uploads',
          'submissions',
          safeStudentId,
        );

        if (!existsSync(uploadDir)) {
          mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
      },
      filename: (_req, file, cb) => {
        // Generate a deterministic, safe filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        const sanitized = sanitizeFilename(file.originalname);
        const ext = extname(sanitized).toLowerCase();
        const nameWithoutExt = sanitized.replace(ext, '');

        cb(null, `submission-${uniqueSuffix}-${nameWithoutExt}${ext}`);
      },
    }),

    fileFilter: (_req, file, cb) => {
      const error = validateFileMimeAndExt(file.mimetype, file.originalname);
      if (error) {
        cb(new BadRequestException(error) as any, false);
      } else {
        cb(null, true);
      }
    },

    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1, // one file per request
    },
  };
}
