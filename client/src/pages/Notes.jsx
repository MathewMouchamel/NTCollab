import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { signInWithGoogle } from "../firebase";

export default function Notes() {
  const { user, setUser } = useAuth();
  const [protectedData, setProtectedData] = useState(null);
  const [showContent, setShowContent] = useState(false);
  // Placeholder for notes array
  const notes = [];

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handlePlusClick = async () => {
    setProtectedData(null);
    let token = user && user.token ? user.token : undefined;
    try {
      const res = await fetch("http://localhost:3000/protected-test", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setProtectedData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignIn = async () => {
    try {
      const { user, token } = await signInWithGoogle();
      setUser({
        name: user.displayName,
        avatar: user.photoURL,
        token,
        email: user.email,
        uid: user.uid,
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (!showContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black"></div>
    );
  }

  return (
    <>
      {!user && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Notes</h1>
          <p className="text-xl font-semibold mb-6 text-center">
            Please sign in to view your notes.
          </p>
          <button
            className="bg-black hover:bg-gray-700 text-white font-semibold px-8 py-3 text-lg rounded-lg transition-colors duration-200 cursor-pointer"
            onClick={handleSignIn}
          >
            Sign in with Google
          </button>
        </div>
      )}
      {user && (
        <div className="min-h-screen bg-white text-black flex flex-col py-12 px-4">
          <h1 className="text-4xl font-bold tracking-tight mt-10 mx-auto">
            Notes
          </h1>
          {notes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Fun black/white SVG (note with a smiley face) */}
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-6"
              >
                <rect
                  x="20"
                  y="20"
                  width="80"
                  height="100"
                  rx="12"
                  fill="#fff"
                  stroke="#000"
                  strokeWidth="4"
                />
                <circle cx="45" cy="60" r="5" fill="#000" />
                <circle cx="75" cy="60" r="5" fill="#000" />
                <path
                  d="M50 80 Q60 90 70 80"
                  stroke="#000"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-xl font-semibold mb-6 text-center">
                No notes yet!
                <br />
                Click below to create your first one.
              </p>
              <button
                className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-200 shadow-lg cursor-pointer"
                aria-label="Add new note"
                onClick={handlePlusClick}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </button>
              {protectedData && (
                <pre className="mt-6 bg-gray-100 p-4 rounded text-left w-full max-w-md overflow-x-auto">
                  {JSON.stringify(protectedData, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <div className="flex-1 w-full max-w-2xl flex flex-col gap-6 items-center justify-center">
              {/* Map over notes here in the future */}
              {/* Example: notes.map(note => <NoteCard key={note.id} ... />) */}
              <button
                className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-200 shadow-lg"
                aria-label="Add new note"
                onClick={handlePlusClick}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </button>
              {protectedData && (
                <pre className="mt-6 bg-gray-100 p-4 rounded text-left w-full max-w-md overflow-x-auto">
                  {JSON.stringify(protectedData, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
