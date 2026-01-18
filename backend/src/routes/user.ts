// src/routes/user.ts
import { Router } from "express";
import { authenticateFirebaseToken } from "../middleware/authMiddleware";
import type { AuthRequest } from "../types/auth-request";
import { querySnowflake } from "../config/snowflake";
import { ensureUserRow } from "../util/helpers";

const router = Router();

// GET /user (auth required)
// Returns the internal DB values for the authenticated user.
// If the user row doesn't exist yet, it creates it (via ensureUserRow) and then returns the row.
router.get("/", authenticateFirebaseToken, async (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthenticated" });

    const uid = req.user.uid;
    const email = req.user.email ?? null;

    try {
        // Create the row if missing
        await ensureUserRow(uid, email);

        const rows = await querySnowflake<{
            userId: string;
            email: string | null;
            phoneNumber: string | null;
            points: number;
            donatedToys: any; // ARRAY
            wishList: any; // ARRAY
            toysForwarded: number;
            toysReceived: number;
            familiesHelped: number;
            wasteReduced: number;
            kidProfiles: any; // VARIANT
            homeArea: string | null;
            preferences: any; // VARIANT
            createdAt: string;
        }>(
            `SELECT
         USER_ID AS "userId",
         EMAIL AS "email",
         PHONE_NUMBER AS "phoneNumber",
         POINTS AS "points",
         DONATED_TOYS AS "donatedToys",
         WISH_LIST AS "wishList",
         TOYS_FORWARDED AS "toysForwarded",
         TOYS_RECEIVED AS "toysReceived",
         FAMILIES_HELPED AS "familiesHelped",
         WASTE_REDUCED AS "wasteReduced",
         KID_PROFILES AS "kidProfiles",
         HOME_AREA AS "homeArea",
         PREFERENCES AS "preferences",
         CREATED_AT AS "createdAt"
       FROM TOY_APP.PUBLIC.USERS
       WHERE USER_ID = ?
       LIMIT 1`,
            [uid]
        );

        if (!rows.length) return res.status(404).json({ error: "User row not found" });

        return res.status(200).json({ user: rows[0] });
    } catch (err) {
        console.error("GET /user failed:", err);
        return res.status(500).json({ error: "Failed to fetch user" });
    }
});

/**
 * PATCH /user (auth required)
 * Update optional fields (phoneNumber, homeArea, kidProfiles, preferences, wishList).
 *
 * Body (all optional):
 * - phoneNumber: string | null
 * - homeArea: string | null
 * - kidProfiles: any[] (stored as VARIANT)
 * - preferences: object (stored as VARIANT)
 * - wishList: string[] (stored as ARRAY)
 */
router.patch("/", authenticateFirebaseToken, async (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthenticated" });

    const uid = req.user.uid;
    const email = req.user.email ?? null;

    try {
        await ensureUserRow(uid, email);

        // Build a safe whitelist update
        const updates: { col: string; val: any }[] = [];

        if (req.body.phoneNumber !== undefined) updates.push({ col: "PHONE_NUMBER", val: req.body.phoneNumber });
        if (req.body.homeArea !== undefined) updates.push({ col: "HOME_AREA", val: req.body.homeArea });

        // VARIANT columns: send JSON, store with PARSE_JSON(?)
        const variantUpdates: { col: string; val: any }[] = [];
        if (req.body.kidProfiles !== undefined) variantUpdates.push({ col: "KID_PROFILES", val: JSON.stringify(req.body.kidProfiles) });
        if (req.body.preferences !== undefined) variantUpdates.push({ col: "PREFERENCES", val: JSON.stringify(req.body.preferences) });

        // ARRAY column: easiest hackathon approach = store as VARIANT array instead.
        // But since you made WISH_LIST an ARRAY, we can set it from JSON using PARSE_JSON(?)
        // Snowflake will coerce VARIANT array -> ARRAY in many cases; if it fails, switch WISH_LIST to VARIANT.
        if (req.body.wishList !== undefined) {
            variantUpdates.push({ col: "WISH_LIST", val: JSON.stringify(req.body.wishList) });
        }

        if (updates.length === 0 && variantUpdates.length === 0) {
            return res.status(400).json({ error: "No fields provided" });
        }

        const setParts: string[] = [];
        const binds: any[] = [];

        for (const u of updates) {
            setParts.push(`${u.col} = ?`);
            binds.push(u.val);
        }
        for (const u of variantUpdates) {
            setParts.push(`${u.col} = PARSE_JSON(?)`);
            binds.push(u.val);
        }

        binds.push(uid);

        await querySnowflake(
            `UPDATE TOY_APP.PUBLIC.USERS
       SET ${setParts.join(", ")}
       WHERE USER_ID = ?`,
            binds
        );

        const rows = await querySnowflake(
            `SELECT
         USER_ID AS "userId",
         EMAIL AS "email",
         PHONE_NUMBER AS "phoneNumber",
         POINTS AS "points",
         DONATED_TOYS AS "donatedToys",
         WISH_LIST AS "wishList",
         KID_PROFILES AS "kidProfiles",
         HOME_AREA AS "homeArea",
         PREFERENCES AS "preferences",
         CREATED_AT AS "createdAt"
       FROM TOY_APP.PUBLIC.USERS
       WHERE USER_ID = ?
       LIMIT 1`,
            [uid]
        );

        return res.status(200).json({ user: rows[0] });
    } catch (err) {
        console.error("PATCH /user failed:", err);
        return res.status(500).json({ error: "Failed to update user" });
    }
});

/**
 * GET /user/recommendations (auth required)
 * Hackathon placeholder.
 */
// router.get("/recommendations", authenticateFirebaseToken, async (req: AuthRequest, res) => {
//     if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
//
//     return res.status(200).json({
//         toys: [
//             {
//                 toyName: "LEGO Fire Truck",
//                 description: "Complete set, lightly used",
//                 category: "Building",
//                 ageRange: "5-7",
//                 condition: "Lightly used",
//                 ownerId: "demo_uid_1",
//                 status: "available",
//                 createdAt: "2026-01-17T22:41:10.123Z",
//             },
//             {
//                 toyName: "Plush Bear",
//                 description: "Clean and soft",
//                 category: "Plush",
//                 ageRange: "3-4",
//                 condition: "Like new",
//                 ownerId: "demo_uid_2",
//                 status: "available",
//                 createdAt: "2026-01-17T22:39:02.515Z",
//             },
//         ],
//     });
// });

export default router;