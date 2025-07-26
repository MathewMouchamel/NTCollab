import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext";
import { signInWithGoogle } from "../firebase";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import ProfileDropdown from "../components/ProfileDropdown";

export default function Notes() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchNotes = useCallback(async () => {
    if (!user?.token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.ok) {
        const notesData = await response.json();

        // Filter notes by selected tags and search query
        let filteredNotes = notesData;

        // Filter by tags
        if (selectedTags.length > 0) {
          filteredNotes = filteredNotes.filter((note) =>
            selectedTags.every(
              (selectedTag) => note.tags && note.tags.includes(selectedTag)
            )
          );
        }

        // Filter by search query (case-insensitive)
        if (searchQuery.trim()) {
          filteredNotes = filteredNotes.filter(
            (note) =>
              note.title &&
              note.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setNotes(filteredNotes);
        // Collect all unique tags from all notes (not just filtered ones)
        const tagsSet = new Set();
        notesData.forEach((note) =>
          (note.tags || []).forEach((tag) => tagsSet.add(tag))
        );
        setAllTags(Array.from(tagsSet));
      } else {
        console.error("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedTags, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      setIsLoading(false);
    }
  }, [user, selectedTags, searchQuery, fetchNotes]);

  const handleCreateNewNote = useCallback(async () => {
    if (!user?.token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notes/blank`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const newNote = await response.json();
        // Navigate to the new note using its UUID
        navigate(`/notes/${newNote.uuid}`);
      } else {
        console.error("Failed to create new note");
      }
    } catch (error) {
      console.error("Error creating new note:", error);
    }
  }, [navigate, user]);

  const handleNoteClick = useCallback(
    async (note) => {
      if (!user?.token) return;

      // Use UUID
      const noteId = note.uuid;

      await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ last_opened: new Date().toISOString() }),
      });

      navigate(`/notes/${noteId}`);
    },
    [navigate, user?.token]
  );

  const handleTagClick = useCallback((tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        // Remove tag if already selected
        return prev.filter((t) => t !== tag);
      } else {
        // Add tag if not selected
        return [...prev, tag];
      }
    });
  }, []);

  const clearAllTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

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
            <div className="flex items-center space-x-4">
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
              <ProfileDropdown />
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-6 w-75 mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-gray-700 transition-colors duration-200"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Tag filter UI */}
          {allTags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2 max-w-4xl mx-auto">
              {selectedTags.length > 0 && (
                <button
                  className="px-3 py-1 rounded-full border-2 border-black bg-red-500 text-white hover:bg-red-400 cursor-pointer"
                  onClick={clearAllTags}
                >
                  Clear All
                </button>
              )}
              {allTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    className={`group relative px-3 py-1 rounded-full border-2 border-black hover:bg-black hover:text-white ${
                      isSelected
                        ? "bg-black text-white hover:line-through decoration-2"
                        : "bg-white text-black"
                    } cursor-pointer transition-colors duration-200`}
                    onClick={() => handleTagClick(tag)}
                  >
                    <span className="block w-full text-center transition-colors duration-200">
                      {tag}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600">Loading notes...</p>
              </div>
            </div>
          ) : notes.length !== 0 ? (
            <div className="flex-1 w-full max-w-4xl mx-auto">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleNoteClick(note)}
                    className="p-4 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer bg-white group"
                  >
                    {/* Show only the title */}
                    <div className="text-xl font-semibold mb-2">
                      {note.title || <em className="opacity-50">Untitled</em>}
                    </div>
                    {/* Show only the tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {note.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-white text-black px-2 py-1 rounded-full border border-black group-hover:bg-black group-hover:text-white group-hover:border-white transition-colors duration-200"
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
          ) : selectedTags.length === 0 && searchQuery.length === 0 ? (
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
                No notes found!
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
