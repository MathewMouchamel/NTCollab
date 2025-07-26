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

- `POST /api/notes` - Create note (legacy)
- `POST /api/notes/blank` - Create blank note (returns note with UUID for immediate editing)
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
- Notes support UUID lookups
- Rich text editor uses Quill.js via react-quill
- Last opened timestamps tracked for note ordering
- Auto-save functionality via PATCH endpoint with 1-second debouncing
- Configuration constants centralized in `client/src/constants.js`
- Components optimized with React.memo, useCallback, and useMemo for performance
- Server middleware available for error handling and validation

## Note Creation Flow

All notes in NoteEditor are existing notes with UUIDs:

1. User clicks "Create New Note" in Notes.jsx
2. Frontend POSTs to `/api/notes/blank` to create empty note in database
3. Server returns note with auto-generated UUID
4. Frontend navigates to `/notes/{uuid}`
5. NoteEditor loads the existing blank note and user can start editing
6. All saves use PATCH/PUT operations on existing note

This eliminates the complexity of handling "new" vs "existing" notes in the editor.

1.  User Profile Dropdown with Avatar & Logout ✅

- ProfileDropdown.jsx: Created dropdown component with
  user avatar and logout functionality
- Shows user's Google avatar with black border matching
  the plus button
- Displays user email on hover and provides logout
  option
- Redirects to homepage after logout for signing into
  different account

2. Public/Private Toggle & Delete Note Options ✅

- NoteEditor Header: Added toggle button for
  public/private status (green when public, gray when
  private)
- Delete Button: Red delete button with confirmation
  modal
- DeleteNoteModal.jsx: Custom modal matching site
  design for delete confirmation
- Auto-saves public/private status changes

3. Search Functionality ✅

- Search Input: Added below tag filtering section with
  search icon
- Case-insensitive Search: Searches note titles (e.g.,
  "he" finds "Hey" and "Hello")
- Real-time Filtering: Updates results as you type
- Combined Filtering: Works together with tag filtering

4. Real-time Collaborative Editing ✅

- WebSocket Server: Set up WebSocket infrastructure on
  port 3000 with /collaboration path
- Yjs Integration: Implemented collaborative document
  editing using Y.js
- Live Indicator: Shows "Live" status when connected to
  collaborative session
- Smart Auto-save: Disables auto-save during
  collaborative sessions to prevent conflicts
- useCollaborativeEditor Hook: Custom hook for managing
  collaborative editing state

Key Technical Implementations:

Backend Changes:

- Added WebSocket server with Y.js integration
- Installed ws, y-websocket, and yjs packages
- Modified server to use HTTP server for WebSocket
  support

Frontend Changes:

- Installed yjs, y-websocket, and y-quill packages
- Created custom hook for collaborative editing
- Updated NoteEditor to support real-time collaboration
- Added profile management and note controls

How Real-time Collaboration Works:

1. Multiple users can open the same note by its UUID
2. WebSocket connection established to /collaboration
   endpoint
3. Y.js synchronizes changes between all connected
   clients
4. Shows "Live" indicator when collaborative session is
   active
5. Changes appear instantly across all connected users

All features maintain your black/white design aesthetic
and provide a professional, Google Docs-like
collaborative experience!
