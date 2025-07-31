import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { QuillBinding } from "y-quill";
import Quill from "quill";
import QuillCursors from "quill-cursors";

Quill.register("modules/cursors", QuillCursors);

const QuillEditor = ({ noteUuid }) => {
  const editorRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const bindingRef = useRef(null);
  const providerRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    // Only initialize if not already done and we have a noteUuid
    if (!editorRef.current || quillInstanceRef.current || !noteUuid) return;

    setIsEditorReady(false);

    const roomname = `note-${noteUuid}`;
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev/ws",
      roomname,
      ydoc
    );
    providerRef.current = provider;
    const ytext = ydoc.getText("quill");

    const editor = new Quill(editorRef.current, {
      modules: {
        cursors: true,
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
        ],
        history: {
          userOnly: true,
        },
      },
      placeholder: "Start collaborating...",
      theme: "snow",
    });
    quillInstanceRef.current = editor;

    const binding = new QuillBinding(ytext, editor, provider.awareness);
    bindingRef.current = binding;

    // Wait for content synchronization before showing editor
    const showEditorTimer = setTimeout(() => {
      setIsEditorReady(true);
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearTimeout(showEditorTimer);
      bindingRef.current?.destroy();
      providerRef.current?.destroy();
      quillInstanceRef.current = null;
      bindingRef.current = null;
      providerRef.current = null;
      setIsEditorReady(false);
    };
  }, [noteUuid]);

  return (
    <div className="relative">
      {/* Hidden editor div for Quill initialization */}
      <div
        ref={editorRef}
        id="editor"
        style={{
          minHeight: "400px",
          visibility: isEditorReady ? "visible" : "hidden",
          position: isEditorReady ? "static" : "absolute",
        }}
      />

      {/* Loading overlay */}
      {!isEditorReady && (
        <div
          className="border-3 border-black rounded-b-[20px] border-t-0"
          style={{ minHeight: "200px" }}
        >
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading note...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuillEditor;
