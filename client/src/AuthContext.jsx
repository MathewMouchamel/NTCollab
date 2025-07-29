// React Context for Firebase authentication state management
// Provides user authentication data throughout the application
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

// Create authentication context for sharing user state
export const AuthContext = createContext();

/**
 * AuthProvider component that wraps the app and provides authentication state
 * Listens to Firebase auth state changes and updates the user context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 */
export function AuthProvider({ children }) {
  // User state: null when not authenticated, object with user data when authenticated
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Subscribe to Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in - get their ID token for API authentication
        const token = await firebaseUser.getIdToken();
        // Create user object with essential data for the app
        setUser({
          name: firebaseUser.displayName,   // Google display name
          avatar: firebaseUser.photoURL,    // Google profile photo URL
          token,                           // Firebase ID token for API calls
          email: firebaseUser.email,        // User's email address
          uid: firebaseUser.uid,           // Unique Firebase user ID
        });
      } else {
        // User is signed out
        setUser(null);
      }
    });
    
    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context
 * @returns {Object} Authentication context containing user data and setUser function
 */
export function useAuth() {
  return useContext(AuthContext);
}
