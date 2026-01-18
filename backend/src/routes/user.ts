// /routes/user.ts
import { Router } from "express";
import { authenticateFirebaseToken } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/auth-request";

const router = Router();

// GET /user (auth required)
router.get("/", authenticateFirebaseToken, async (req: AuthRequest, res) => {
    return res.status(200).json({
        uid: req.user?.uid ?? "demo_uid_123",
        email: req.user?.email ?? "demo@example.com",
        points: 0,
    });
});

// GET /user/recommendations (auth required)
router.get("/recommendations", authenticateFirebaseToken, async (_req, res) => {
    return res.status(200).json({
        toys: [
            {
                toyName: "LEGO Fire Truck",
                description: "Complete set, lightly used",
                category: "building_blocks",
                ageRange: "5-7",
                condition: "good",
                ownerId: "demo_uid_1",
                status: "available",
                createdAt: "2026-01-17T22:41:10.123Z",
            },
            {
                toyName: "Plush Bear",
                description: "Clean and soft",
                category: "plush",
                ageRange: "3-4",
                condition: "good",
                ownerId: "demo_uid_2",
                status: "available",
                createdAt: "2026-01-17T22:39:02.515Z",
            },
        ],
    });
});

export default router;