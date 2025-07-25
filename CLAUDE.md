# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack note-taking application with Firebase authentication and Supabase backend:

- **client/**: React frontend (Vite + TailwindCSS + React Router)
- **server/**: Express.js API server with Firebase auth middleware
- **infra/**: Infrastructure configuration

## Development Commands

### Client (React Frontend)
```bash
cd client
npm run dev      # Start development server (localhost:5173)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Server (API Backend)
```bash
cd server
npm run dev      # Start development server with auto-restart
npm run start    # Start production server
npm run check    # Validate configuration (Firebase/Supabase setup)
```

### Root Project
```bash
# No scripts defined at root level - work in client/ or server/ directories
```

## Architecture Overview

### Authentication Flow
- Frontend uses Firebase Auth for user authentication
- Backend verifies Firebase tokens via `verifyFirebaseToken` middleware
- User context managed through React's `AuthContext`

### Data Storage
- **Supabase**: Primary database for notes storage
- **Firebase**: Authentication provider only
- Notes support: content (rich text), tags, public/private visibility, titles, UUIDs

### API Endpoints
All note operations are under `/api/notes`:
- `POST /api/notes` - Create note
- `GET /api/notes` - List user's notes (supports `?tag=` and `?uuid=` filters)
- `GET /api/notes/:id` - Get specific note (supports UUID or numeric ID)
- `PUT /api/notes/:id` - Full update note
- `PATCH /api/notes/:id` - Partial update (for auto-save)
- `DELETE /api/notes/:id` - Delete note

### Key Components
- **client/src/AuthContext.jsx**: Firebase auth state management
- **client/src/pages/NoteEditor.jsx**: Rich text editor using React-Quill
- **client/src/pages/Notes.jsx**: Notes listing with tag filtering
- **server/verifyFirebaseToken.js**: Auth middleware
- **server/supabaseClient.js**: Database client setup

## Environment Setup

### Required Server Environment Variables (.env)
```
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Firebase Configuration
Either use `server/serviceAccountKey.json` or environment variables for Firebase Admin SDK.

## Development Notes

- Frontend runs on port 5173, backend on port 3000
- CORS configured for `http://localhost:5173`
- Notes support both UUID and numeric ID lookups for backward compatibility
- Rich text editor uses Quill.js via react-quill
- Last opened timestamps tracked for note ordering
- Auto-save functionality via PATCH endpoint with 1-second debouncing
- Configuration constants centralized in `client/src/constants.js`
- Components optimized with React.memo, useCallback, and useMemo for performance
- Server middleware available for error handling and validation