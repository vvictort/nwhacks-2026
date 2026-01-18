import {querySnowflake} from "../config/snowflake";

export async function ensureUserRow(uid: string, email: string | null): Promise<void> {
    await querySnowflake(
        `MERGE INTO TOY_APP.PUBLIC.USERS u
     USING (SELECT ? AS USER_ID, ? AS EMAIL) s
     ON u.USER_ID = s.USER_ID
     WHEN NOT MATCHED THEN
       INSERT (USER_ID, EMAIL) VALUES (s.USER_ID, s.EMAIL)
     WHEN MATCHED THEN
       UPDATE SET EMAIL = COALESCE(s.EMAIL, u.EMAIL)`,
        [uid, email]
    );
}

/**
 * Enums (match Gemini output formatting: Title Case + spaces)
 */
export const ALLOWED_CATEGORIES = new Set([
    "Figures",
    "Building",
    "Games",
    "Puzzles",
    "Crafts",
    "Active",
    "Vehicles",
    "STEM",
    "Pretend",
    "Plush",
]);
export const ALLOWED_CONDITIONS = new Set([
    "New in Box",
    "Like new",
    "Lightly used",
    "Well used",
    "Heavily used",
]);
export const ALLOWED_STATUSES = new Set(["draft", "available", "reserved", "completed"]);
export const MAX_TOY_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_AGE_RANGE_LENGTH = 30;
export const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB decoded
const MAX_IMAGE_BASE64_LEN = Math.ceil(MAX_IMAGE_BYTES * 4 / 3) + 4; // rough bound
function stripDataUrlPrefix(b64: string): string {
    // Accept "data:image/jpeg;base64,...." but store only the payload
    return b64.replace(/^data:image\/jpeg;base64,/i, "").trim();
}

function isBase64Like(s: string): boolean {
    // Basic check (not perfect, but good enough)
    // Allows + / = and alphanumerics
    return /^[A-Za-z0-9+/=\s]+$/.test(s);
}

function isJpegBytes(buf: Buffer): boolean {
    // JPEG SOI: FF D8, JPEG EOI: FF D9
    return buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8 && buf[buf.length - 2] === 0xff && buf[buf.length - 1] === 0xd9;
}

export function parseAndValidateJpegBase64(input: unknown): { ok: true; b64: string; bytes: number } | {
    ok: false;
    error: string
} {
    const raw = pickString(input);
    if (!raw) return {ok: false, error: "Image must be a non-empty base64 string"};

    // Enforce jpeg data URL if they send data URLs (optional but requested)
    const hasDataUrl = /^data:/i.test(raw);
    if (hasDataUrl && !/^data:image\/jpeg;base64,/i.test(raw)) {
        return {ok: false, error: "Only data:image/jpeg;base64 images are allowed"};
    }

    const b64 = stripDataUrlPrefix(raw);

    // quick size gate before decoding (prevents huge decode work)
    if (b64.length > MAX_IMAGE_BASE64_LEN) {
        return {ok: false, error: `Image too large (max ${MAX_IMAGE_BYTES} bytes)`};
    }

    if (!isBase64Like(b64)) {
        return {ok: false, error: "Invalid base64 encoding"};
    }

    let buf: Buffer;
    try {
        buf = Buffer.from(b64, "base64");
    } catch {
        return {ok: false, error: "Invalid base64 encoding"};
    }

    if (buf.length === 0) return {ok: false, error: "Invalid base64 encoding"};
    if (buf.length > MAX_IMAGE_BYTES) return {ok: false, error: `Image too large (max ${MAX_IMAGE_BYTES} bytes)`};
    if (!isJpegBytes(buf)) return {ok: false, error: "Image is not a valid JPEG"};

    return {ok: true, b64, bytes: buf.length};
}

export function pickString(input: unknown): string | null {
    if (input == null) return null;
    const s = String(input).trim();
    return s.length ? s : null;
}

export function validateLength(
    value: string | null,
    maxLength: number,
    fieldName: string
): { valid: boolean; error?: string } {
    if (value && value.length > maxLength) {
        return {valid: false, error: `${fieldName} exceeds maximum length of ${maxLength} characters`};
    }
    return {valid: true};
}

export function normalizeStatus(input: unknown): string | null {
    if (input == null) return null;
    const s = String(input).trim().toLowerCase();
    return ALLOWED_STATUSES.has(s) ? s : null;
}

export function validateCategory(input: unknown): string | null {
    const v = pickString(input);
    if (!v) return null;
    return ALLOWED_CATEGORIES.has(v) ? v : null;
}

export function validateCondition(input: unknown): string | null {
    const v = pickString(input);
    if (!v) return null;
    return ALLOWED_CONDITIONS.has(v) ? v : null;
}