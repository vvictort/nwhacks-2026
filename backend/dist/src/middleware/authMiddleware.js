"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateFirebaseToken = void 0;
const firebase_1 = require("../config/firebase");
/**
 * Middleware to authenticate Firebase token from Authorization header.
 */
const authenticateFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const idToken = authHeader.slice('Bearer '.length).trim();
    try {
        const user = await firebase_1.auth.verifyIdToken(idToken);
        req.user = user;
        return next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticateFirebaseToken = authenticateFirebaseToken;
