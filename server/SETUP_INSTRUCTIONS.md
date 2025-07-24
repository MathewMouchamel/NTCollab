# Setup Instructions

## Issues Fixed

### 1. Server Configuration Issues
- Fixed missing environment variables
- Added graceful Firebase Admin SDK configuration
- Added better error handling and validation

### 2. React-Quill Deprecation Warnings
- Optimized component using useCallback
- Added content validation to prevent empty saves

### 3. API 400 Errors
- Enhanced server-side validation
- Added comprehensive error logging
- Better error messages for debugging

## Required Configuration

### Server Setup (in `server/.env`)

```env
PORT=3000
SUPABASE_URL=your_actual_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_actual_supabase_service_role_key

# Firebase Admin SDK Configuration (if not using serviceAccountKey.json)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_CLIENT_ID=your_firebase_client_id
FIREBASE_CLIENT_CERT_URL=your_firebase_client_cert_url
```

### Alternative: Firebase Service Account File

Instead of environment variables, you can create `server/serviceAccountKey.json`:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

## How to Start

1. **Configure Environment Variables**: Update `server/.env` with your actual values
2. **Check Configuration**: `cd server && npm run check` (optional - validates setup)
3. **Start Server**: `cd server && npm run dev`
4. **Start Client**: `cd client && npm run dev`

## Quick Configuration Check

Run `npm run check` in the server directory to validate your configuration before starting.

## Debugging

If you're still getting 400 errors:

1. Check server console for detailed error messages
2. Verify Supabase credentials are correct
3. Ensure Firebase authentication is working
4. Check browser Network tab for request details

## React-Quill Warnings

The findDOMNode deprecation warnings from react-quill are known issues with React 18. They don't affect functionality but can be minimized by:

- Using the latest version of react-quill (already done)
- The optimizations made to the NoteEditor component
- These warnings should disappear when react-quill fully supports React 18