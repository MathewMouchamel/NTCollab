import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { QuillBinding } from "y-quill";
import Quill from "quill";
import QuillCursors from "quill-cursors";

Quill.register("modules/cursors", QuillCursors);

const QuillEditor = () => {
  const editorRef = useRef(null);
  const [isConnected, setIsConnected] = useState(true);
  const providerRef = useRef(null);

  useEffect(() => {
    const roomname = `codemirror-demo-${new Date().toLocaleDateString(
      "en-CA"
    )}`;

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

    const binding = new QuillBinding(ytext, editor, provider.awareness);

    // Cleanup on unmount
    return () => {
      binding.destroy();
      provider.destroy();
    };
  }, []);

  return (
    <div>
      <div ref={editorRef} id="editor" style={{ minHeight: "500px" }} />
    </div>
  );
};

export default QuillEditor;
