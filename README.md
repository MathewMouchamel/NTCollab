# NTCollab

**Work Smarter, Together. Effortless Collaboration.**

Welcome to NTCollab—a professional, fun, and fast platform for collaborative note-taking. NTCollab is designed for teams, students, and creators who want to write, organize, and collaborate on notes without clutter or fuss.

## ✨ Features

- **Collaborative Notes, Simplified:**  
  NTCollab lets multiple users work together on the same note in real time. You’ll see changes appear instantly—just like Google Docs, but with a minimalist black-and-white aesthetic.
- **Tag Your Notes:**  
  Organize notes with easy tagging. Find what you need quickly and keep your workspace focused.
- **Fast & Secure:**  
  NTCollab uses Firebase authentication to keep your notes private and secure.  
  Your data is backed by Supabase, ensuring reliability and speed.
- **Rich Text Editing:**  
  Write with style using a Quill.js powered editor—bold, italic, lists, code blocks, and more.
- **Auto-Save:**  
  Never lose your work—notes are auto-saved every second.
- **Note Ordering:**  
  Notes are sorted by last opened time, so your most recent work is always at your fingertips.
- **Minimal UI:**  
  The interface is clean and distraction-free. Focus on your ideas.

## 🛠️ Project Structure

- `client/` — React frontend (Vite + TailwindCSS + React Router)
- `server/` — Express.js API server with Firebase authentication middleware

## 🚀 Quick Start

1. **Clone the repo:**  
   `git clone https://github.com/MathewMouchamel/NTCollab.git`
2. **Install dependencies:**  
   - Client:  
     ```
     cd client
     npm install
     ```
   - Server:  
     ```
     cd server
     npm install
     ```
3. **Run the app:**  
   - Client:  
     `npm run dev` (localhost:5173)
   - Server:  
     `npm run dev` (localhost:3000)

## 🔒 Authentication & Security

- Sign in with Google—no passwords to remember.
- Notes are stored securely using Supabase and Firebase.
- Only you and your collaborators can see your notes.

## 🌐 Real-Time Collaboration

- Open a note with its unique link.
- NTCollab connects you and your team via WebSockets and Y.js for real-time editing.
- Every keystroke is synced.  
- See who’s active with a “Live” indicator.

## 🖋️ Design Philosophy

- **Minimal, Yet Powerful:**  
  No clutter. Every feature is here to help you write and collaborate better.
- **Professional Look:**  
  The black-and-white design keeps things classy and easy on the eyes.
- **Performance First:**  
  React.memo, useCallback, and useMemo are used to keep everything fast.

## ⚙️ Environment Setup

- **Server Variables (.env):**
  ```
  PORT=3000
  SUPABASE_URL=your_supabase_url
  SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
  ```
- **Frontend runs on port 5173.**
- **Backend runs on port 3000.**

## 💡 Development Notes

- Rich text editor powered by Quill.js via react-quill.
- Components are optimized for smooth performance.
- Auto-save is handled with a 1-second debounce.
- Note lookups use UUIDs for privacy and speed.
- Centralized configuration constants in `client/src/constants.js`.

## 🤝 Contributing

Want to add features or fix bugs?  
Fork this repo, make your changes, and submit a pull request.  
All contributions, big or small, are welcome!

## 📚 License

This project currently does not specify a license.  
Please contact the maintainer for usage questions.

## 🦸‍♂️ About the Author

Created by [MathewMouchamel](https://github.com/MathewMouchamel).

---

**Start collaborating. Start creating. NTCollab makes teamwork simple.**
