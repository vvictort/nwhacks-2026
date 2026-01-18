// /routes/me.ts
import { Router } from "express";
import { authenticateFirebaseToken } from "../middleware/authMiddleware";
import {AuthRequest} from "../types/auth-request"; // adjust path if needed

const router = Router();

// GET /me (auth required)
router.get("/me", authenticateFirebaseToken, async (req: AuthRequest, res) => {
    // req.user is set by auth middleware
    return res.status(200).json({
        uid: req.user?.uid ?? null,
        email: req.user?.email ?? null,
        points: 0, // TODO: fetch from DB
    });
});

// GET /me/recommendations (auth required)
router.get("/me/recommendations", authenticateFirebaseToken, async (_req, res) => {
    // TODO: compute recommendations (likely based on /toys filtering + ranking)
    return res.status(200).json({ toys: [] });
});

export default router;