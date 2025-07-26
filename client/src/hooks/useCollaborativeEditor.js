import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';

export function useCollaborativeEditor(noteId, quillRef, onContentChange) {
  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);

  useEffect(() => {
    if (!noteId || !quillRef.current) return;

    // Create Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // Create WebSocket provider
    const wsUrl = `ws://localhost:3000/collaboration`;
    const provider = new WebsocketProvider(wsUrl, noteId, ydoc);
    providerRef.current = provider;

    // Get the shared text object
    const ytext = ydoc.getText('quill');

    // Wait for Quill to be ready
    const quill = quillRef.current.getEditor();
    
    // Create binding between Yjs and Quill
    const binding = new QuillBinding(ytext, quill);
    bindingRef.current = binding;

    // Listen to content changes
    const handleTextChange = () => {
      const content = quill.root.innerHTML;
      onContentChange(content);
    };

    // Add listener for text changes
    ytext.observe(handleTextChange);

    // Cleanup function
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (ydocRef.current) {
        ydocRef.current.destroy();
      }
    };
  }, [noteId, quillRef, onContentChange]);

  return {
    ydoc: ydocRef.current,
    provider: providerRef.current,
    binding: bindingRef.current
  };
}