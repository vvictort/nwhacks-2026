import type { NextFunction, Response } from 'express';
import { auth } from '../config/firebase.js'
import type { AuthRequest } from '../types/auth-request';

/**
 * Middleware to authenticate Firebase token from Authorization header.
 */
export const authenticateFirebaseToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const idToken = authHeader.slice('Bearer '.length).trim();

    try {
        const user = await auth.verifyIdToken(idToken);
        req.user = user;
        console.log('Authenticated user:', user.uid);
        return next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
