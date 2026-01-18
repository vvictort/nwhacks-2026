"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/toys.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const snowflake_1 = require("../config/snowflake");
const router = (0, express_1.Router)();
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
function pickString(input) {
    if (input == null)
        return null;
    const s = String(input).trim();
    return s.length ? s : null;
}
function validateLength(value, maxLength, fieldName) {
    if (value && value.length > maxLength) {
        return { valid: false, error: `${fieldName} exceeds maximum length of ${maxLength} characters` };
    }
    return { valid: true };
}
function normalizeStatus(input) {
    if (input == null)
        return null;
    const s = String(input).trim().toLowerCase();
    return ALLOWED_STATUSES.has(s) ? s : null;
}
function validateCategory(input) {
    const v = pickString(input);
    if (!v)
        return null;
    return ALLOWED_CATEGORIES.has(v) ? v : null;
}
function validateCondition(input) {
    const v = pickString(input);
    if (!v)
        return null;
    return ALLOWED_CONDITIONS.has(v) ? v : null;
}
/**
 * GET /toys (public)
 * Lists available toys.
 */
router.get("/", async (_req, res) => {
    try {
        const toys = await (0, snowflake_1.querySnowflake)(`SELECT
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
                 LIMIT ?`, [50]);
        return res.status(200).json({ toys });
    }
    catch (err) {
        console.error("GET /toys failed:", err);
        return res.status(500).json({ error: "Failed to fetch toys" });
    }
});
/**
 * GET /toys/:toyName (public)
 * Fetches one toy by name.
 */
router.get("/:toyName", async (req, res) => {
    const toyName = req.params.toyName;
    try {
        const rows = await (0, snowflake_1.querySnowflake)(`SELECT
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
                 LIMIT 1`, [toyName]);
        if (!rows.length)
            return res.status(404).json({ error: "Toy not found" });
        return res.status(200).json(rows[0]);
    }
    catch (err) {
        console.error("GET /toys/:toyName failed:", err);
        return res.status(500).json({ error: "Failed to fetch toy" });
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
 */
router.post("/", authMiddleware_1.authenticateFirebaseToken, async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "Unauthenticated" });
        const ownerId = req.user.uid;
        const toyName = pickString(req.body.toyName ?? req.body.toy_name);
        if (!toyName)
            return res.status(400).json({ error: "toyName is required" });
        const toyNameCheck = validateLength(toyName, MAX_TOY_NAME_LENGTH, "toyName");
        if (!toyNameCheck.valid)
            return res.status(400).json({ error: toyNameCheck.error });
        const description = pickString(req.body.description);
        const descCheck = validateLength(description, MAX_DESCRIPTION_LENGTH, "description");
        if (!descCheck.valid)
            return res.status(400).json({ error: descCheck.error });
        const category = validateCategory(req.body.category);
        if (req.body.category != null && category == null) {
            return res.status(400).json({ error: "Invalid category", allowed: Array.from(ALLOWED_CATEGORIES) });
        }
        const ageRange = pickString(req.body.ageRange ?? req.body.age_range);
        const ageRangeCheck = validateLength(ageRange, MAX_AGE_RANGE_LENGTH, "ageRange");
        if (!ageRangeCheck.valid)
            return res.status(400).json({ error: ageRangeCheck.error });
        const condition = validateCondition(req.body.condition);
        if (req.body.condition != null && condition == null) {
            return res.status(400).json({ error: "Invalid condition", allowed: Array.from(ALLOWED_CONDITIONS) });
        }
        const status = normalizeStatus(req.body.status) ?? "available";
        // Optional pre-check for nicer 409 (still handle duplicates on insert too)
        const existingToy = await (0, snowflake_1.querySnowflake)(`SELECT 1 FROM TOY_APP.PUBLIC.TOYS WHERE TOY_NAME = ? LIMIT 1`, [toyName]);
        if (existingToy.length > 0) {
            return res.status(409).json({ error: "A toy with this name already exists" });
        }
        // Insert (also handle race duplicates)
        try {
            await (0, snowflake_1.querySnowflake)(`INSERT INTO TOY_APP.PUBLIC.TOYS
           (TOY_NAME, DESCRIPTION, CATEGORY, AGE_RANGE, CONDITION, OWNER_ID, STATUS)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [toyName, description, category, ageRange, condition, ownerId, status]);
        }
        catch (e) {
            const msg = String(e?.message ?? e ?? "").toLowerCase();
            if (msg.includes("duplicate") || msg.includes("primary key")) {
                return res.status(409).json({ error: "A toy with this name already exists" });
            }
            throw e;
        }
        const created = await (0, snowflake_1.querySnowflake)(`SELECT
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
                 LIMIT 1`, [toyName]);
        return res.status(201).json({ toy: created[0] ?? { toyName } });
    }
    catch (err) {
        console.error("POST /toys failed:", err);
        return res.status(500).json({ error: "Failed to create toy" });
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
router.patch("/:toyName", authMiddleware_1.authenticateFirebaseToken, async (req, res) => {
    const toyName = req.params.toyName;
    try {
        if (!req.user)
            return res.status(401).json({ error: "Unauthenticated" });
        const ownerId = req.user.uid;
        const existing = await (0, snowflake_1.querySnowflake)(`SELECT OWNER_ID AS "ownerId"
             FROM TOY_APP.PUBLIC.TOYS
             WHERE TOY_NAME = ?
                 LIMIT 1`, [toyName]);
        if (!existing.length)
            return res.status(404).json({ error: "Toy not found" });
        if (existing[0].ownerId !== ownerId)
            return res.status(403).json({ error: "Not allowed to edit this toy" });
        const updates = [];
        if (req.body.description !== undefined) {
            const desc = pickString(req.body.description);
            const descCheck = validateLength(desc, MAX_DESCRIPTION_LENGTH, "description");
            if (!descCheck.valid)
                return res.status(400).json({ error: descCheck.error });
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
            if (!arCheck.valid)
                return res.status(400).json({ error: arCheck.error });
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
        if (!filtered.length)
            return res.status(400).json({ error: "No valid fields provided for update" });
        const setClause = filtered.map((u) => `${u.col} = ?`).join(", ");
        const binds = filtered.map((u) => u.val);
        binds.push(toyName);
        await (0, snowflake_1.querySnowflake)(`UPDATE TOY_APP.PUBLIC.TOYS
             SET ${setClause}
             WHERE TOY_NAME = ?`, binds);
        const updated = await (0, snowflake_1.querySnowflake)(`SELECT
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
                 LIMIT 1`, [toyName]);
        return res.status(200).json({ toy: updated[0] });
    }
    catch (err) {
        console.error("PATCH /toys/:toyName failed:", err);
        return res.status(500).json({ error: "Failed to update toy" });
    }
});
exports.default = router;
