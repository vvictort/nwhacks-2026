// src/routes/toys.ts
import { Router } from "express";
import type { Response } from "express";
import { authenticateFirebaseToken } from "../middleware/authMiddleware";
import type { AuthRequest } from "../types/auth-request";
import { querySnowflake } from "../config/snowflake";
import {ensureUserRow} from "../util/helpers";

const router = Router();

/**
 * Enums (match Gemini output formatting: Title Case + spaces)
 */
const ALLOWED_CATEGORIES = new Set([
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

const ALLOWED_CONDITIONS = new Set([
    "New in Box",
    "Like new",
    "Lightly used",
    "Well used",
    "Heavily used",
]);

const ALLOWED_STATUSES = new Set(["draft", "available", "reserved", "completed"]);

const MAX_TOY_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_AGE_RANGE_LENGTH = 30;

const MAX_IMAGES = 3;
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

function parseAndValidateJpegBase64(input: unknown): { ok: true; b64: string; bytes: number } | { ok: false; error: string } {
    const raw = pickString(input);
    if (!raw) return { ok: false, error: "Image must be a non-empty base64 string" };

    // Enforce jpeg data URL if they send data URLs (optional but requested)
    const hasDataUrl = /^data:/i.test(raw);
    if (hasDataUrl && !/^data:image\/jpeg;base64,/i.test(raw)) {
        return { ok: false, error: "Only data:image/jpeg;base64 images are allowed" };
    }

    const b64 = stripDataUrlPrefix(raw);

    // quick size gate before decoding (prevents huge decode work)
    if (b64.length > MAX_IMAGE_BASE64_LEN) {
        return { ok: false, error: `Image too large (max ${MAX_IMAGE_BYTES} bytes)` };
    }

    if (!isBase64Like(b64)) {
        return { ok: false, error: "Invalid base64 encoding" };
    }

    let buf: Buffer;
    try {
        buf = Buffer.from(b64, "base64");
    } catch {
        return { ok: false, error: "Invalid base64 encoding" };
    }

    if (buf.length === 0) return { ok: false, error: "Invalid base64 encoding" };
    if (buf.length > MAX_IMAGE_BYTES) return { ok: false, error: `Image too large (max ${MAX_IMAGE_BYTES} bytes)` };
    if (!isJpegBytes(buf)) return { ok: false, error: "Image is not a valid JPEG" };

    return { ok: true, b64, bytes: buf.length };
}

function pickString(input: unknown): string | null {
    if (input == null) return null;
    const s = String(input).trim();
    return s.length ? s : null;
}

function validateLength(
    value: string | null,
    maxLength: number,
    fieldName: string
): { valid: boolean; error?: string } {
    if (value && value.length > maxLength) {
        return { valid: false, error: `${fieldName} exceeds maximum length of ${maxLength} characters` };
    }
    return { valid: true };
}

function normalizeStatus(input: unknown): string | null {
    if (input == null) return null;
    const s = String(input).trim().toLowerCase();
    return ALLOWED_STATUSES.has(s) ? s : null;
}

function validateCategory(input: unknown): string | null {
    const v = pickString(input);
    if (!v) return null;
    return ALLOWED_CATEGORIES.has(v) ? v : null;
}

function validateCondition(input: unknown): string | null {
    const v = pickString(input);
    if (!v) return null;
    return ALLOWED_CONDITIONS.has(v) ? v : null;
}

// GET /toys/:toyName/images (public)
router.get("/:toyName/images", async (req, res) => {
    try {
        const toyName = req.params.toyName;

        const rows = await querySnowflake(
            `SELECT
         IMAGE_ID   AS "imageId",
         IMAGE_DATA AS "imageData",
         CREATED_AT AS "createdAt"
       FROM TOY_APP.PUBLIC.TOY_IMAGES
       WHERE TOY_NAME = ?
       ORDER BY CREATED_AT DESC
       LIMIT ?`,
            [toyName, 5]
        );

        return res.status(200).json({ toyName, images: rows });
    } catch (err) {
        console.error("GET /toys/:toyName/images failed:", err);
        return res.status(500).json({ error: "Failed to fetch images" });
    }
});

/**
 * GET /toys/:toyName (public)
 * Fetches one toy by name.
 */
router.get("/:toyName", async (req, res: Response) => {
    const toyName = req.params.toyName;

    try {
        const rows = await querySnowflake(
            `SELECT
                 TOY_NAME    AS "toyName",
                 DESCRIPTION AS "description",
                 CATEGORY    AS "category",
                 AGE_RANGE   AS "ageRange",
                 CONDITION   AS "condition",
                 OWNER_ID    AS "ownerId",
                 STATUS      AS "status",
                 CREATED_AT  AS "createdAt"
             FROM TOY_APP.PUBLIC.TOYS
             WHERE TOY_NAME = ?
                 LIMIT 1`,
            [toyName]
        );

        if (!rows.length) return res.status(404).json({ error: "Toy not found" });
        return res.status(200).json(rows[0]);
    } catch (err) {
        console.error("GET /toys/:toyName failed:", err);
        return res.status(500).json({ error: "Failed to fetch toy" });
    }
});

/**
 * PATCH /toys/:toyName (auth required)
 * Only the owner can update.
 *
 * Allowed fields:
 * - description
 * - category (must match ALLOWED_CATEGORIES)
 * - ageRange / age_range
 * - condition (must match ALLOWED_CONDITIONS)
 * - status (draft|available|reserved|completed)
 */
router.patch("/:toyName", authenticateFirebaseToken, async (req: AuthRequest, res: Response) => {
    const toyName = req.params.toyName;

    try {
        if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
        const ownerId = req.user.uid;
        await ensureUserRow(ownerId, req.user.email ?? null);

        const existing = await querySnowflake<{ ownerId: string }>(
            `SELECT OWNER_ID AS "ownerId"
             FROM TOY_APP.PUBLIC.TOYS
             WHERE TOY_NAME = ?
                 LIMIT 1`,
            [toyName]
        );

        if (!existing.length) return res.status(404).json({ error: "Toy not found" });
        if (existing[0].ownerId !== ownerId) return res.status(403).json({ error: "Not allowed to edit this toy" });

        const updates: { col: string; val: any }[] = [];

        if (req.body.description !== undefined) {
            const desc = pickString(req.body.description);
            const descCheck = validateLength(desc, MAX_DESCRIPTION_LENGTH, "description");
            if (!descCheck.valid) return res.status(400).json({ error: descCheck.error });
            updates.push({ col: "DESCRIPTION", val: desc });
        }

        if (req.body.category !== undefined) {
            const cat = validateCategory(req.body.category);
            if (req.body.category != null && cat == null) {
                return res.status(400).json({ error: "Invalid category", allowed: Array.from(ALLOWED_CATEGORIES) });
            }
            updates.push({ col: "CATEGORY", val: cat });
        }

        if (req.body.ageRange !== undefined || req.body.age_range !== undefined) {
            const ar = pickString(req.body.ageRange ?? req.body.age_range);
            const arCheck = validateLength(ar, MAX_AGE_RANGE_LENGTH, "ageRange");
            if (!arCheck.valid) return res.status(400).json({ error: arCheck.error });
            updates.push({ col: "AGE_RANGE", val: ar });
        }

        if (req.body.condition !== undefined) {
            const cond = validateCondition(req.body.condition);
            if (req.body.condition != null && cond == null) {
                return res.status(400).json({ error: "Invalid condition", allowed: Array.from(ALLOWED_CONDITIONS) });
            }
            updates.push({ col: "CONDITION", val: cond });
        }

        if (req.body.status !== undefined) {
            const st = normalizeStatus(req.body.status);
            if (req.body.status != null && st == null) {
                return res.status(400).json({ error: "Invalid status", allowed: Array.from(ALLOWED_STATUSES) });
            }
            updates.push({ col: "STATUS", val: st });
        }

        const filtered = updates.filter((u) => u.col && u.val !== undefined);
        if (!filtered.length) return res.status(400).json({ error: "No valid fields provided for update" });

        const setClause = filtered.map((u) => `${u.col} = ?`).join(", ");
        const binds = filtered.map((u) => u.val);
        binds.push(toyName);

        await querySnowflake(
            `UPDATE TOY_APP.PUBLIC.TOYS
             SET ${setClause}
             WHERE TOY_NAME = ?`,
            binds
        );

        const updated = await querySnowflake(
            `SELECT
                 TOY_NAME    AS "toyName",
                 DESCRIPTION AS "description",
                 CATEGORY    AS "category",
                 AGE_RANGE   AS "ageRange",
                 CONDITION   AS "condition",
                 OWNER_ID    AS "ownerId",
                 STATUS      AS "status",
                 CREATED_AT  AS "createdAt"
             FROM TOY_APP.PUBLIC.TOYS
             WHERE TOY_NAME = ?
                 LIMIT 1`,
            [toyName]
        );

        return res.status(200).json({ toy: updated[0] });
    } catch (err) {
        console.error("PATCH /toys/:toyName failed:", err);
        return res.status(500).json({ error: "Failed to update toy" });
    }
});


/**
 * GET /toys (public)
 * Lists available toys.
 */
router.get("/", async (_req, res: Response) => {
    try {
        const toys = await querySnowflake(
            `SELECT
                 TOY_NAME    AS "toyName",
                 DESCRIPTION AS "description",
                 CATEGORY    AS "category",
                 AGE_RANGE   AS "ageRange",
                 CONDITION   AS "condition",
                 OWNER_ID    AS "ownerId",
                 STATUS      AS "status",
                 CREATED_AT  AS "createdAt"
             FROM TOY_APP.PUBLIC.TOYS
             WHERE COALESCE(STATUS, 'available') = 'available'
             ORDER BY CREATED_AT DESC
                 LIMIT ?`,
            [50]
        );

        return res.status(200).json({ toys });
    } catch (err) {
        console.error("GET /toys failed:", err);
        return res.status(500).json({ error: "Failed to fetch toys" });
    }
});

/**
 * POST /toys (auth required)
 * Creates a toy listing owned by the authenticated user.
 *
 * Body (camelCase preferred; snake_case accepted):
 * - toyName / toy_name (required)
 * - description (optional)
 * - category (optional)         -> must be one of ALLOWED_CATEGORIES (Title Case)
 * - ageRange / age_range (optional)
 * - condition (optional)        -> must be one of ALLOWED_CONDITIONS (with spaces)
 * - status (optional)           -> draft|available|reserved|completed
 * - images (optional)           -> array of base64 jpeg strings (max 5 images)
 */
// Example input:
//{
//   "toyName": "Wooden Train Set",
//   "description": "All tracks included.",
//   "category": "Vehicles",
//   "ageRange": "3-5",
//   "condition": "Well used",
//   "status": "available",
//   "images": [
//     "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
//     "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
//   ]
// }
router.post("/", authenticateFirebaseToken, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
        const ownerId = req.user.uid;

        // Ensure user exists
        await ensureUserRow(ownerId, req.user.email ?? null);

        const toyName = pickString(req.body.toyName ?? req.body.toy_name);
        if (!toyName) return res.status(400).json({ error: "toyName is required" });

        const toyNameCheck = validateLength(toyName, MAX_TOY_NAME_LENGTH, "toyName");
        if (!toyNameCheck.valid) return res.status(400).json({ error: toyNameCheck.error });

        const description = pickString(req.body.description);
        const descCheck = validateLength(description, MAX_DESCRIPTION_LENGTH, "description");
        if (!descCheck.valid) return res.status(400).json({ error: descCheck.error });

        const category = validateCategory(req.body.category);
        if (req.body.category != null && category == null) {
            return res.status(400).json({ error: "Invalid category", allowed: Array.from(ALLOWED_CATEGORIES) });
        }

        const ageRange = pickString(req.body.ageRange ?? req.body.age_range);
        const ageRangeCheck = validateLength(ageRange, MAX_AGE_RANGE_LENGTH, "ageRange");
        if (!ageRangeCheck.valid) return res.status(400).json({ error: ageRangeCheck.error });

        const condition = validateCondition(req.body.condition);
        if (req.body.condition != null && condition == null) {
            return res.status(400).json({ error: "Invalid condition", allowed: Array.from(ALLOWED_CONDITIONS) });
        }

        const status = normalizeStatus(req.body.status) ?? "available";

        // Optional images: req.body.images is an array of base64 jpeg strings
        const imagesInput = req.body.images;
        let images: string[] = [];

        if (imagesInput !== undefined && imagesInput !== null) {
            if (!Array.isArray(imagesInput)) {
                return res.status(400).json({ error: "images must be an array of base64 JPEG strings" });
            }
            if (imagesInput.length > MAX_IMAGES) {
                return res.status(400).json({ error: `Too many images (max ${MAX_IMAGES})` });
            }

            const validated: string[] = [];
            for (let i = 0; i < imagesInput.length; i++) {
                const v = parseAndValidateJpegBase64(imagesInput[i]);
                if (!v.ok) {
                    return res.status(400).json({ error: `images[${i}]: ${v.error}` });
                }
                validated.push(v.b64);
            }
            images = validated;
        }

        // Optional pre-check for nicer 409 (still handle duplicates on insert too)
        const existingToy = await querySnowflake(
            `SELECT 1 FROM TOY_APP.PUBLIC.TOYS WHERE TOY_NAME = ? LIMIT 1`,
            [toyName]
        );
        if (existingToy.length > 0) {
            return res.status(409).json({ error: "A toy with this name already exists" });
        }

        // Insert toy
        try {
            await querySnowflake(
                `INSERT INTO TOY_APP.PUBLIC.TOYS
         (TOY_NAME, DESCRIPTION, CATEGORY, AGE_RANGE, CONDITION, OWNER_ID, STATUS)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [toyName, description, category, ageRange, condition, ownerId, status]
            );
        } catch (e: any) {
            const msg = String(e?.message ?? e ?? "").toLowerCase();
            if (msg.includes("duplicate") || msg.includes("primary key")) {
                return res.status(409).json({ error: "A toy with this name already exists" });
            }
            throw e;
        }

        // Insert images (best-effort; no transaction)
        const imageIds: string[] = [];
        for (let i = 0; i < images.length; i++) {
            const imageId = `IMG_${Date.now()}_${i}`;
            imageIds.push(imageId);

            await querySnowflake(
                `INSERT INTO TOY_APP.PUBLIC.TOY_IMAGES (IMAGE_ID, TOY_NAME, IMAGE_DATA)
         VALUES (?, ?, ?)`,
                [imageId, toyName, images[i]]
            );
        }

        // Add toyName to USERS.DONATED_TOYS (avoid duplicates)
        await querySnowflake(
            `UPDATE TOY_APP.PUBLIC.USERS
       SET DONATED_TOYS =
         CASE
           WHEN ARRAY_CONTAINS(TO_VARIANT(?), DONATED_TOYS) THEN DONATED_TOYS
           ELSE ARRAY_APPEND(DONATED_TOYS, ?)
         END
       WHERE USER_ID = ?`,
            [toyName, toyName, ownerId]
        );

        const created = await querySnowflake(
            `SELECT
         TOY_NAME    AS "toyName",
         DESCRIPTION AS "description",
         CATEGORY    AS "category",
         AGE_RANGE   AS "ageRange",
         CONDITION   AS "condition",
         OWNER_ID    AS "ownerId",
         STATUS      AS "status",
         CREATED_AT  AS "createdAt"
       FROM TOY_APP.PUBLIC.TOYS
       WHERE TOY_NAME = ?
       LIMIT 1`,
            [toyName]
        );

        return res.status(201).json({
            toy: created[0] ?? { toyName },
            imageIds,
        });
    } catch (err) {
        console.error("POST /toys failed:", err);
        return res.status(500).json({ error: "Failed to create toy" });
    }
});

export default router;
