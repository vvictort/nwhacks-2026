import { Router } from "express";
import { authenticateFirebaseToken } from "../middleware/authMiddleware.js";
import { AuthRequest } from "../types/auth-request";

const router = Router();

// POST /toys (auth required)
router.post("/toys", authenticateFirebaseToken, async (req: AuthRequest, res) => {
    // TODO: create toy
    return res.status(201).json({ message: "TODO: created toy" });
});

// PATCH /toys/:toyName (auth required)
router.patch("/toys/:toyName", authenticateFirebaseToken, async (req: AuthRequest, res) => {
    const { toyName } = req.params;
    // TODO: update toy
    return res.status(200).json({ message: "TODO: updated toy", toyName });
});

// GET /toys (public)
router.get("/toys", async (_req, res) => {
    // TODO: list toys
    return res.status(200).json({ toys: [] });
});

// GET /toys/:toyName (public, optional but usually needed)
router.get("/toys/:toyName", async (req, res) => {
    const { toyName } = req.params;
    // TODO: fetch toy details
    return res.status(200).json({ toyName });
});

export default router;