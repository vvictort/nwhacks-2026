// /routes/toys.ts
import { Router } from "express";
import { authenticateFirebaseToken } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/auth-request";

const router = Router();

// POST /toys (auth required)
router.post("/", authenticateFirebaseToken, async (req: AuthRequest, res) => {
    // Hardcoded "created toy" response (ignores request body for now)
    return res.status(201).json({
        toy: {
            toyName: "Hot Wheels Track Set",
            description: "Includes 8 cars, one ramp missing",
            category: "vehicles",
            ageRange: "5-7",
            condition: "used",
            ownerId: req.user?.uid ?? "demo_uid_123",
            status: "available",
            createdAt: "2026-01-17T22:55:30.000Z",
        },
    });
});

// PATCH /toys/:toyName (auth required)
router.patch("/:toyName", authenticateFirebaseToken, async (req: AuthRequest, res) => {
    const { toyName } = req.params;

    return res.status(200).json({
        toy: {
            toyName,
            description: "Updated description (hardcoded)",
            category: "building_blocks",
            ageRange: "5-7",
            condition: "good",
            ownerId: req.user?.uid ?? "demo_uid_123",
            status: "draft",
            createdAt: "2026-01-17T22:55:30.000Z",
        },
    });
});

// GET /toys/ (public)
router.get("/", async (_req, res) => {
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
            {
                toyName: "Hot Wheels Track Set",
                description: "Includes 8 cars, one ramp missing",
                category: "vehicles",
                ageRange: "5-7",
                condition: "used",
                ownerId: "demo_uid_3",
                status: "available",
                createdAt: "2026-01-17T22:35:30.000Z",
            },
        ],
    });
});

// GET /toys/:toyName (public)
router.get("/:toyName", async (req, res) => {
    const { toyName } = req.params;

    return res.status(200).json({
        toyName,
        description: "Toy details (hardcoded)",
        category: "building_blocks",
        ageRange: "5-7",
        condition: "good",
        ownerId: "demo_uid_1",
        status: "available",
        createdAt: "2026-01-17T22:41:10.123Z",
    });
});

export default router;