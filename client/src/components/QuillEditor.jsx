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

  const handleConnectionToggle = () => {
    if (providerRef.current) {
      if (providerRef.current.shouldConnect) {
        providerRef.current.disconnect();
        setIsConnected(false);
      } else {
        providerRef.current.connect();
        setIsConnected(true);
      }
    }
  };

  return (
    <div>
      <button type="button" onClick={handleConnectionToggle}>
        {isConnected ? "Disconnect" : "Connect"}
      </button>
      <p></p>
      <p>
        This is a demo of the <a href="https://github.com/yjs/yjs">Yjs</a> ⇔{" "}
        <a href="https://quilljs.com/">Quill</a> binding:{" "}
        <a href="https://github.com/yjs/y-quill">y-quill</a>.
      </p>
      <p>
        The content of this editor is shared with every client that visits this
        domain.
      </p>
      <div ref={editorRef} id="editor" style={{ minHeight: "500px" }} />
    </div>
  );
};

export default QuillEditor;
