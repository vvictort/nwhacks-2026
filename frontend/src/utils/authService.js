import {
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

// Sign in with Google redirect (avoids COOP errors)
export const signInWithGoogle = async () => {
    try {
        await signInWithRedirect(auth, googleProvider);
        // User will be redirected - no return value here
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

// Handle redirect result after sign-in
export const handleRedirectResult = async () => {
    try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
            const idToken = await result.user.getIdToken();
            localStorage.setItem('authToken', idToken);
            return { user: result.user, idToken };
        }
        return null;
    } catch (error) {
        console.error('Error handling redirect:', error);
        throw error;
    }
};

// Sign out
export const signOutUser = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('authToken');
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

// Get current user's ID token for API calls
export const getCurrentUserToken = async () => {
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken(true); // force refresh
    }
    return null;
};

// Listen for auth state changes
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const token = await user.getIdToken();
            localStorage.setItem('authToken', token);
            callback(user);
        } else {
            localStorage.removeItem('authToken');
            callback(null);
        }
    });
};
