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
        localStorage.removeItem('mockUser');
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

// Mock sign in for demo purposes
export const mockSignIn = async (email) => {
    try {
        const mockUser = {
            uid: 'mock-user-id',
            email: email,
            displayName: 'Demo User',
            photoURL: null
        };
        const mockToken = 'mock-auth-token-' + Date.now();

        // Store mock user and token
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));

        return { user: mockUser, idToken: mockToken };
    } catch (error) {
        console.error('Error in mock sign in:', error);
        throw error;
    }
};

// Listen for auth state changes
export const onAuthChange = (callback) => {
    // Check for mock user first
    const mockUserData = localStorage.getItem('mockUser');
    if (mockUserData) {
        try {
            const mockUser = JSON.parse(mockUserData);
            callback(mockUser);
        } catch (e) {
            localStorage.removeItem('mockUser');
        }
    }

    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const token = await user.getIdToken();
            localStorage.setItem('authToken', token);
            callback(user);
        } else {
            // Check for mock user again
            const mockUserData = localStorage.getItem('mockUser');
            if (mockUserData) {
                try {
                    const mockUser = JSON.parse(mockUserData);
                    callback(mockUser);
                } catch (e) {
                    localStorage.removeItem('mockUser');
                    callback(null);
                }
            } else {
                localStorage.removeItem('authToken');
                callback(null);
            }
        }
    });
};
