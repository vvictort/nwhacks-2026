import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

// Sign in with Google popup
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const idToken = await user.getIdToken();

        // Store token for API calls
        localStorage.setItem('authToken', idToken);

        return { user, idToken };
    } catch (error) {
        console.error('Error signing in with Google:', error);
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
