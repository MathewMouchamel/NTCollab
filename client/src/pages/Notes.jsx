import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { signInWithGoogle } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Fetch notes when user is available
  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/notes", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const notesData = await response.json();
        setNotes(notesData);
      } else {
        console.error("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewNote = () => {
    navigate("/notes/new");
  };

  const handleNoteClick = (note) => {
    // Use UUID if available, otherwise fall back to id
    const noteId = note.uuid || note.id;
    navigate(`/notes/${noteId}`);
  };

  const getPreviewText = (content) => {
    // Strip HTML tags and get first 100 characters
    const textContent = content.replace(/<[^>]*>/g, "");
    return textContent.length > 100 ? textContent.substring(0, 100) + "..." : textContent;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <div className="flex items-center justify-between max-w-4xl mx-auto w-full mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Notes</h1>
            <button
              className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-200 shadow-lg cursor-pointer"
              aria-label="Create new note"
              onClick={handleCreateNewNote}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600">Loading notes...</p>
              </div>
            </div>
          ) : notes.length === 0 ? (
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
                Click the + button to create your first one.
              </p>
            </div>
          ) : (
            <div className="flex-1 w-full max-w-4xl mx-auto">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleNoteClick(note)}
                    className="p-4 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer bg-white"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm opacity-70">
                        {formatDate(note.created_at)}
                      </div>
                      {note.public && (
                        <div className="text-xs bg-black text-white px-2 py-1 rounded">
                          Public
                        </div>
                      )}
                    </div>
                    <div className="leading-relaxed">
                      {note.content ? (
                        getPreviewText(note.content)
                      ) : (
                        <em className="opacity-50">Empty note</em>
                      )}
                    </div>
                    {note.tags && note.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {note.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-200 text-black px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
