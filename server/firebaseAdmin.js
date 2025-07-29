// Firebase Admin SDK configuration
// Handles initialization with either service account file or environment variables
import admin from "firebase-admin";
import fs from "fs";

// Service account configuration and initialization status
let serviceAccount;
let firebaseInitialized = false;

// First, try to load Firebase configuration from service account JSON file
try {
  serviceAccount = JSON.parse(
    fs.readFileSync("./serviceAccountKey.json", "utf8")
  );
  console.log("Firebase Admin SDK: Using serviceAccountKey.json");
} catch (error) {
  console.warn("Warning: serviceAccountKey.json not found. Checking environment variables for Firebase admin.");
  
  // Define required environment variables for Firebase admin
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY_ID', 
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_CLIENT_ID'
  ];
  
  // Check which required environment variables are missing
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`Error: Missing Firebase environment variables: ${missingVars.join(', ')}`);
    console.error("Firebase Admin SDK will not be initialized. Authentication may not work properly.");
    console.error("Please configure either serviceAccountKey.json or the required environment variables.");
  } else {
    // Fallback: create service account object from environment variables
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      // Replace escaped newlines in private key with actual newlines
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
    };
    console.log("Firebase Admin SDK: Using environment variables");
  }
}

// Initialize Firebase Admin SDK if configuration is available and not already initialized
if (serviceAccount && !admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    firebaseInitialized = true;
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error.message);
    console.error("Authentication may not work properly. Please check your Firebase configuration.");
  }
}

// Export Firebase Admin SDK instance for use in other modules
export default admin;
