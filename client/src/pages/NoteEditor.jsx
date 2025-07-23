import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const AUTOSAVE_DELAY = 1000; // ms

export default function NoteEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Idle"); // Idle | Saving | Saved | Error
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const saveTimeout = useRef(null);
  const [unsaved, setUnsaved] = useState(false);

  // Fetch note on mount
  useEffect(() => {
    if (!user) return;
    const fetchNote = async () => {
      setStatus("Loading");
      setError(null);
      try {
        const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch note");
        const data = await res.json();
        setContent(data.content || "");
        setStatus("Idle");
        setInitialLoad(false);
      } catch (err) {
        setError(err.message);
        setStatus("Error");
      }
    };
    fetchNote();
    // eslint-disable-next-line
  }, [id, user]);

  // Auto-save logic (debounced)
  const saveNote = useCallback(async (newContent) => {
    if (!user) return;
    setStatus("Saving");
    setError(null);
    setUnsaved(true);
    try {
      const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ content: newContent }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      setStatus("Saved");
      setUnsaved(false);
      setTimeout(() => setStatus("Idle"), 1000);
    } catch (err) {
      setError(err.message);
      setStatus("Error");
    }
  }, [id, user]);

  // Debounce save
  useEffect(() => {
    if (initialLoad) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveNote(content);
    }, AUTOSAVE_DELAY);
    return () => clearTimeout(saveTimeout.current);
    // eslint-disable-next-line
  }, [content]);

  // Warn on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsaved) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsaved]);

  if (!user) {
    return <div className="p-8">Please sign in to edit notes.</div>;
  }
  if (status === "Loading") {
    return <div className="p-8">Loading...</div>;
  }
  if (error) {
    return (
      <div className="p-8 text-red-600">
        Error: {error}
        <button className="ml-4 underline" onClick={() => navigate("/notes")}>Back to Notes</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <textarea
          className="w-full min-h-[300px] border border-gray-300 rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start writing your note..."
        />
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {status === "Saving" && "Saving..."}
            {status === "Saved" && "Saved"}
            {status === "Error" && "Error saving"}
            {status === "Idle" && unsaved && "Unsaved changes"}
            {status === "Idle" && !unsaved && "All changes saved"}
          </span>
          <button className="ml-auto underline" onClick={() => navigate("/notes")}>Back to Notes</button>
        </div>
      </div>
    </div>
  );
}