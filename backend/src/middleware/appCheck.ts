import { Request, Response, NextFunction } from 'express';
import { getAppCheck } from 'firebase-admin/app-check';

export const verifyAppCheck = async (req: Request, res: Response, next: NextFunction) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');

  if (!appCheckToken) {
    // The following code will block instead of logging the issue, only add after testing
    // return res.status(401).json({ error: 'App Check token missing' });

    console.warn(`[AppCheck Monitoring] Missing token from IP: ${req.ip} for ${req.originalUrl}`);
    return next();
  }

  try {
    // This verifies the token against Firebase's servers
    await getAppCheck().verifyToken(appCheckToken);
    next();
  } catch (err) {
    console.error('App Check verification failed:', err);
    // Same comment as above
    // return res.status(401).json({ error: 'Unauthorized: Invalid App Check token' });
    next();
  }
};