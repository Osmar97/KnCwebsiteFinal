// Shared, strict client-side upload validation utilities.
// These are a defence-in-depth layer — server RLS policies are the authority.

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const VIDEO_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime", // .mov
  "video/x-msvideo", // .avi
]);

const VIDEO_EXTENSIONS = new Set([
  ".mp4",
  ".webm",
  ".ogg",
  ".mov",
  ".avi",
  ".mkv",
]);

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
]);

const PDF_MIME_TYPES = new Set([
  "application/pdf",
]);

const PDF_EXTENSIONS = new Set([".pdf"]);

function getExtension(name: string): string {
  const lastDot = name.lastIndexOf(".");
  return lastDot === -1 ? "" : name.slice(lastDot).toLowerCase();
}

function validateExtension(
  file: File,
  allowed: Set<string>,
  label: string
): ValidationResult {
  const ext = getExtension(file.name);
  if (!ext || !allowed.has(ext)) {
    return {
      valid: false,
      error: `${file.name}: Invalid extension (${ext || "none"}). Allowed ${label}: ${Array.from(allowed).join(", ")}`,
    };
  }
  return { valid: true };
}

function validateMimeType(
  file: File,
  allowed: Set<string>,
  label: string
): ValidationResult {
  if (!file.type || !allowed.has(file.type)) {
    return {
      valid: false,
      error: `${file.name}: Invalid type (${file.type || "unknown"}). Allowed ${label}: ${Array.from(allowed).join(", ")}`,
    };
  }
  return { valid: true };
}

function validateSize(file: File, maxBytes: number, label: string): ValidationResult {
  if (file.size > maxBytes) {
    const maxMb = (maxBytes / 1024 / 1024).toFixed(0);
    return {
      valid: false,
      error: `${file.name} exceeds ${maxMb}MB (${(file.size / 1024 / 1024).toFixed(1)}MB).`,
    };
  }
  return { valid: true };
}

/**
 * Validate a video file.
 * @param maxMb — default 500
 */
export function validateVideo(file: File, maxMb = 500): ValidationResult {
  const size = validateSize(file, maxMb * 1024 * 1024, "video");
  if (!size.valid) return size;

  const mime = validateMimeType(file, VIDEO_MIME_TYPES, "video types");
  if (!mime.valid) return mime;

  const ext = validateExtension(file, VIDEO_EXTENSIONS, "video extensions");
  if (!ext.valid) return ext;

  return { valid: true };
}

/**
 * Validate an image file.
 * @param maxMb — default 10
 */
export function validateImage(file: File, maxMb = 10): ValidationResult {
  const size = validateSize(file, maxMb * 1024 * 1024, "image");
  if (!size.valid) return size;

  const mime = validateMimeType(file, IMAGE_MIME_TYPES, "image types");
  if (!mime.valid) return mime;

  const ext = validateExtension(file, IMAGE_EXTENSIONS, "image extensions");
  if (!ext.valid) return ext;

  return { valid: true };
}

/**
 * Validate a PDF file.
 * @param maxMb — default 50
 */
export function validatePdf(file: File, maxMb = 50): ValidationResult {
  const size = validateSize(file, maxMb * 1024 * 1024, "PDF");
  if (!size.valid) return size;

  const mime = validateMimeType(file, PDF_MIME_TYPES, "PDF types");
  if (!mime.valid) return mime;

  const ext = validateExtension(file, PDF_EXTENSIONS, "PDF extensions");
  if (!ext.valid) return ext;

  return { valid: true };
}

/**
 * Validate a floor-plan image (same as image but larger default size).
 * @param maxMb — default 20
 */
export function validateFloorPlan(file: File, maxMb = 20): ValidationResult {
  return validateImage(file, maxMb);
}

/**
 * Build a strict `accept` attribute string for <input type="file">
 */
export const ACCEPT_STRINGS = {
  video: "video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo",
  image: "image/jpeg,image/png,image/webp,image/gif,image/svg+xml",
  pdf: "application/pdf",
} as const;
