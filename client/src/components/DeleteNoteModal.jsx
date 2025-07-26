import { useCallback } from 'react';

export default function DeleteNoteModal({ isOpen, onDelete, onCancel, noteTitle }) {
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white border-2 border-black rounded-lg p-6 max-w-md mx-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black">Delete Note</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete "{noteTitle || 'Untitled'}"? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 border-2 border-black rounded bg-white text-black hover:bg-black hover:text-white transition-colors duration-200"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 border-2 border-red-500 rounded bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}