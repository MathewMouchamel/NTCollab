import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { QuillBinding } from "y-quill";
import Quill from "quill";

const QuillEditor = ({ noteUuid }) => {
  const editorRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const bindingRef = useRef(null);
  const providerRef = useRef(null);

  useEffect(() => {
    // Only initialize if not already done and we have a noteUuid
    if (!editorRef.current || quillInstanceRef.current || !noteUuid) return;

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

    // Cleanup on unmount
    return () => {
      bindingRef.current?.destroy();
      providerRef.current?.destroy();
      quillInstanceRef.current = null;
      bindingRef.current = null;
      providerRef.current = null;
    };
  }, [noteUuid]);

  return (
    <div>
      <div ref={editorRef} id="editor" style={{ minHeight: "400px" }} />
    </div>
  );
};

export default QuillEditor;
