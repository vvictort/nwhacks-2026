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
    // Helper to check and return mock user
    const getMockUser = () => {
        const mockUserData = localStorage.getItem('mockUser');
        if (mockUserData) {
            try {
                return JSON.parse(mockUserData);
            } catch (e) {
                localStorage.removeItem('mockUser');
                return null;
            }
        }
        return null;
    };

    // Check for mock user first and call callback
    const mockUser = getMockUser();
    if (mockUser) {
        // Use setTimeout to ensure this runs after the listener is set up
        // and to give consistent async behavior
        setTimeout(() => callback(mockUser), 0);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Real Firebase user takes priority
            const token = await user.getIdToken();
            localStorage.setItem('authToken', token);
            // Clear any mock user if real user exists
            localStorage.removeItem('mockUser');
            callback(user);
        } else {
            // No Firebase user - check for mock user
            const mockUser = getMockUser();
            if (mockUser) {
                callback(mockUser);
            } else {
                localStorage.removeItem('authToken');
                callback(null);
            }
        }
    });

    return unsubscribe;
};
