// Delete confirmation modal component
// Provides a confirmation dialog before permanently deleting a note
import { useCallback } from "react";

/**
 * DeleteNoteModal - Confirmation modal for note deletion
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onDelete - Callback function when user confirms deletion
 * @param {Function} onCancel - Callback function when user cancels deletion
 * @param {string} noteTitle - Title of the note being deleted (for display)
 */
export default function DeleteNoteModal({
  isOpen,
  onDelete,
  onCancel,
  noteTitle,
}) {
  /**
   * Handles clicks on the modal backdrop (outside the modal content)
   * Closes the modal if user clicks outside the content area
   */
  const handleBackdropClick = useCallback(
    (e) => {
      // Only close if clicking the backdrop itself, not child elements
      if (e.target === e.currentTarget) {
        onCancel();
      }
    },
    [onCancel]
  );

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    // Modal backdrop - covers entire screen with semi-transparent overlay
    <div
      className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      {/* Modal content container */}
      <div className="bg-white border-2 border-black rounded-lg p-6 max-w-md mx-4 shadow-lg">
        {/* Modal title */}
        <h2 className="text-xl font-bold mb-4 text-black">Delete Note</h2>
        
        {/* Confirmation message with note title */}
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete "{noteTitle || "Untitled"}"? This
          action cannot be undone.
        </p>
        
        {/* Action buttons - Cancel and Delete */}
        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 border-2 border-black rounded bg-white text-black hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 border-2 border-black rounded bg-red-500 text-white hover:bg-red-800 transition-colors duration-200 cursor-pointer"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
