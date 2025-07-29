// Firebase authentication middleware for Express.js
// Verifies Firebase ID tokens and attaches user info to requests
import admin from "./firebaseAdmin.js";

/**
 * Middleware function to verify Firebase ID tokens
 * Extracts the Bearer token from Authorization header and validates it
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @param {Function} next - Express next middleware function
 */
export async function verifyFirebaseToken(req, res, next) {
  // Extract Authorization header from request
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header exists and has correct format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Extract the actual token (remove "Bearer " prefix)
  const idToken = authHeader.split(" ")[1];

  try {
    // Verify the Firebase ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Attach the decoded user information to the request object
    // This makes user data available to subsequent middleware/routes
    req.user = decodedToken;
    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Token verification failed (invalid, expired, etc.)
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
