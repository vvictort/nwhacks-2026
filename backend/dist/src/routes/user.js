"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/user.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// GET /user (auth required)
router.get("/", authMiddleware_1.authenticateFirebaseToken, async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: "Unauthenticated" });
    return res.status(200).json({
        uid: req.user.uid,
        email: req.user.email ?? null,
        points: 0,
    });
});
// GET /user/recommendations (auth required)
router.get("/recommendations", authMiddleware_1.authenticateFirebaseToken, async (_req, res) => {
    return res.status(200).json({
        toys: [
            {
                toyName: "LEGO Fire Truck",
                description: "Complete set, lightly used",
                category: "Building",
                ageRange: "5-7",
                condition: "Lightly used",
                ownerId: "demo_uid_1",
                status: "available",
                createdAt: "2026-01-17T22:41:10.123Z",
            },
            {
                toyName: "Plush Bear",
                description: "Clean and soft",
                category: "Plush",
                ageRange: "3-4",
                condition: "Like new",
                ownerId: "demo_uid_2",
                status: "available",
                createdAt: "2026-01-17T22:39:02.515Z",
            },
        ],
    });
});
exports.default = router;
