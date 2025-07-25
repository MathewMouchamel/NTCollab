import { useCallback } from 'react';

export default function UnsavedChangesModal({ isOpen, onSaveChanges, onDiscardChanges, onCancel }) {
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
        <h2 className="text-xl font-bold mb-4 text-black">Unsaved Changes</h2>
        <p className="text-gray-700 mb-6">
          You have unsaved changes. What would you like to do?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 border-2 border-black rounded bg-white text-black hover:bg-black hover:text-white transition-colors duration-200"
            onClick={onDiscardChanges}
          >
            Discard Changes
          </button>
          <button
            className="px-4 py-2 border-2 border-black rounded bg-black text-white hover:bg-gray-800 transition-colors duration-200"
            onClick={onSaveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}