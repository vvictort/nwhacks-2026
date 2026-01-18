import type { Request } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthRequest extends Request {
    user?: DecodedIdToken;
}