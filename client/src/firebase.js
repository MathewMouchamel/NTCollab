import { initializeApp } from "firebase/app";
// Import Auth SDKs
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
const auth = getAuth(app); // Define auth once at the top
export { auth }; // Export auth so you can use it elsewhere

// Reusable Google sign-in function
export const signInWithGoogle = async () => {
  try {
    // Check if user is already signed in - use the existing auth instance
    let currentUser = auth.currentUser;

    // User is not signed in, proceed with Google sign-in
    if (!currentUser) {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      currentUser = result.currentUser;
    }

    const token = await currentUser.getIdToken();
    return {
      user: currentUser,
      token,
    };
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};
