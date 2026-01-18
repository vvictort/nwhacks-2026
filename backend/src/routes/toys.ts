// src/routes/toys.ts
import type { Response } from "express";
import { Router } from "express";
import { authenticateFirebaseToken } from "../middleware/authMiddleware";
import type { AuthRequest } from "../types/auth-request";
import { querySnowflake } from "../config/snowflake";
import {
    ALLOWED_CATEGORIES,
    ALLOWED_CONDITIONS,
    ALLOWED_STATUSES,
    ensureUserRow,
    MAX_AGE_RANGE_LENGTH,
    MAX_DESCRIPTION_LENGTH,
    MAX_IMAGES,
    MAX_TOY_NAME_LENGTH,
    normalizeStatus,
    parseAndValidateJpegBase64,
    pickString,
    validateCategory,
    validateCondition,
    validateLength
} from "../util/helpers";

const router = Router();

/**
 * GET /toys (public)
 * Lists available toys.
 * NOTE: This must be defined BEFORE /:toyName routes to avoid route conflicts
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
 * POST /toys/:toyName/claim (auth required)
 * Claims a toy - marks it as reserved and adds it to the user's received toys.
 * Only works for available toys that the user doesn't own.
 */
router.post("/:toyName/claim", authenticateFirebaseToken, async (req: AuthRequest, res: Response) => {
    const toyName = req.params.toyName;

    try {
        if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
        const claimerId = req.user.uid;
        await ensureUserRow(claimerId, req.user.email ?? null);

        // Check toy exists and is available
        const existing = await querySnowflake<{ ownerId: string; status: string }>(
            `SELECT OWNER_ID AS "ownerId", STATUS AS "status"
             FROM TOY_APP.PUBLIC.TOYS
             WHERE TOY_NAME = ?
             LIMIT 1`,
            [toyName]
        );

        if (!existing.length) return res.status(404).json({ error: "Toy not found" });

        const toy = existing[0];

        // Can't claim your own toy
        if (toy.ownerId === claimerId) {
            return res.status(400).json({ error: "You cannot claim your own toy" });
        }

        // Can only claim available toys
        if (toy.status !== 'available') {
            return res.status(400).json({ error: "This toy is no longer available" });
        }

        // Update toy status to reserved
        await querySnowflake(
            `UPDATE TOY_APP.PUBLIC.TOYS
             SET STATUS = 'reserved'
             WHERE TOY_NAME = ?`,
            [toyName]
        );

        // Add to claimer's wish_list (claimed/received toys)
        await querySnowflake(
            `UPDATE TOY_APP.PUBLIC.USERS
             SET WISH_LIST =
               CASE
                 WHEN WISH_LIST IS NULL THEN ARRAY_CONSTRUCT(?)
                 WHEN ARRAY_CONTAINS(TO_VARIANT(?), WISH_LIST) THEN WISH_LIST
                 ELSE ARRAY_APPEND(WISH_LIST, ?)
               END
             WHERE USER_ID = ?`,
            [toyName, toyName, toyName, claimerId]
        );

        // Fetch updated toy
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

        return res.status(200).json({
            message: "Toy claimed successfully!",
            toy: updated[0]
        });
    } catch (err) {
        console.error("POST /toys/:toyName/claim failed:", err);
        return res.status(500).json({ error: "Failed to claim toy" });
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
