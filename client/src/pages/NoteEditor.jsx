import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/quill-custom.css";
import {
  API_BASE_URL,
  AUTO_SAVE_DELAY,
  QUILL_MODULES,
  QUILL_FORMATS,
} from "../constants";

export default function NoteEditor() {
  const { id: noteUuid } = useParams(); // id is always a UUID
  const navigate = useNavigate();
  const { user } = useAuth();
  const [note, setNote] = useState({
    title: "",
    content: "",
    tags: [],
    public: false,
  });
  const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, saved, error
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [noteId, setNoteId] = useState(null); // Store the numeric ID for API calls
  const saveTimeoutRef = useRef(null);
  const quillRef = useRef(null);

  // Memoize Quill configuration to prevent unnecessary re-renders
  const modules = useMemo(() => QUILL_MODULES, []);
  const formats = useMemo(() => QUILL_FORMATS, []);

  const fetchNote = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteUuid}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const noteData = await response.json();
        setNote(noteData);
        // Store the numeric ID for API operations
        setNoteId(noteData.uuid);
      } else {
        console.error("Failed to fetch note");
        navigate("/notes");
      }
    } catch (error) {
      console.error("Error fetching note:", error);
      navigate("/notes");
    } finally {
      setIsLoading(false);
    }
  }, [noteUuid, user, navigate]);

  const saveNote = useCallback(
    async (noteToSave, isPartialUpdate = false) => {
      // Don't save if we don't have the noteId yet
      if (!noteId) {
        console.log("Note not loaded yet, skipping save");
        return;
      }

      setSaveStatus("saving");
      try {
        // Always use the numeric ID for updates since all notes are existing
        const url = `${API_BASE_URL}/notes/${noteId}`;
        const method = isPartialUpdate ? "PATCH" : "PUT";

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(noteToSave),
        });

        if (response.ok) {
          const savedNote = await response.json();
          setNote(savedNote);
          setSaveStatus("saved");
          setHasUnsavedChanges(false);

          // Clear saved status after 2 seconds
          setTimeout(() => setSaveStatus("idle"), 2000);
        } else {
          setSaveStatus("error");
          setTimeout(() => setSaveStatus("idle"), 3000);
        }
      } catch (error) {
        console.error("Error saving note:", error);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    },
    [noteId, user]
  );

  // Always fetch the note since all notes are existing
  useEffect(() => {
    if (noteUuid && user) {
      fetchNote();
    }
  }, [noteUuid, user, fetchNote]);

  // Handle navigation warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        const noteToSave = { content: note.content };
        saveNote(noteToSave, true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [note, saveNote]);

  const debouncedSave = useCallback(
    (content) => {
      setHasUnsavedChanges(true);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        const noteToSave = { content }; // Always PATCH for existing notes
        saveNote(noteToSave, true);
      }, AUTO_SAVE_DELAY);
    },
    [saveNote]
  );

  const handleContentChange = useCallback(
    (content) => {
      // Validate content to prevent empty saves
      if (content === "<p><br></p>" || content === "") {
        content = "";
      }
      setNote((prev) => ({ ...prev, content }));
      debouncedSave(content);
    },
    [debouncedSave]
  );

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setNote((prev) => ({ ...prev, title: newTitle }));
    setHasUnsavedChanges(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const noteToSave = { title: newTitle };
      saveNote(noteToSave, true);
    }, AUTO_SAVE_DELAY);
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setNote((prev) => ({ ...prev, tags }));
    setHasUnsavedChanges(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const noteToSave = { tags };
      saveNote(noteToSave, true);
    }, AUTO_SAVE_DELAY);
  };

  const handleBackToNotes = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    navigate("/notes");
  };

  const getStatusDisplay = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <span className="text-gray-600 flex items-center">
            <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Saving...
          </span>
        );
      case "saved":
        return (
          <span className="text-black flex items-center">
            <svg
              className="h-4 w-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Saved
          </span>
        );
      case "error":
        return (
          <span className="text-black flex items-center">
            <svg
              className="h-4 w-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Error saving
          </span>
        );
      default:
        return hasUnsavedChanges ? (
          <span className="text-gray-600">Unsaved changes</span>
        ) : null;
    }
  };

  if (!user) {
    navigate("/notes");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b-2 border-black px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center">
            <button
              onClick={handleBackToNotes}
              className="flex items-center text-gray-600 hover:text-black transition-colors mr-4"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Notes
            </button>
          </div>
          <div className="text-sm">{getStatusDisplay()}</div>
        </div>
      </div>
      {/* Title and Tags */}
      <div className="max-w-4xl mx-auto px-4 pt-6 flex flex-col gap-4">
        <input
          className="text-2xl font-bold border-b-2 border-black outline-none mb-2 bg-white"
          type="text"
          placeholder="Title"
          value={note.title}
          onChange={handleTitleChange}
          maxLength={100}
        />
        <input
          className="text-base border-b border-gray-300 outline-none mb-2 bg-white"
          type="text"
          placeholder="Tags (comma separated)"
          value={note.tags.join(", ")}
          onChange={handleTagsChange}
        />
      </div>
      {/* Editor */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={note.content}
          onChange={handleContentChange}
          modules={modules}
          formats={formats}
          placeholder="Start writing your note..."
        />
      </div>
    </div>
  );
}
