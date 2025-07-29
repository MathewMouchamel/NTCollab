// Firebase client-side configuration and authentication utilities
// Configures Firebase app and provides Google sign-in functionality
import { initializeApp } from "firebase/app";
// Import Auth SDKs
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration using Vite environment variables
// These are loaded from .env files and injected at build time
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app with configuration
const app = initializeApp(firebaseConfig);
export { app };

// Create authentication instance tied to the Firebase app
const auth = getAuth(app);
export { auth };

/**
 * Reusable Google sign-in function using Firebase Auth
 * Handles both new sign-ins and already authenticated users
 * @returns {Object} Object containing user data and ID token
 * @throws {Error} Firebase authentication errors
 */
export const signInWithGoogle = async () => {
  try {
    // Check if user is already signed in to avoid unnecessary popup
    let currentUser = auth.currentUser;

    // If user is not signed in, initiate Google sign-in popup
    if (!currentUser) {
      const provider = new GoogleAuthProvider();
      // Show Google sign-in popup and wait for user selection
      const result = await signInWithPopup(auth, provider);
      currentUser = result.user;
    }

    // Get fresh ID token for API authentication
    const token = await currentUser.getIdToken();
    return {
      user: currentUser,  // Firebase user object with profile data
      token,             // JWT token for API authentication
    };
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error; // Re-throw for handling by calling component
  }
};
