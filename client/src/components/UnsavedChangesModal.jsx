import { useEffect } from "react";

export default function UnsavedChangesModal({ saveNote }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      saveNote();
    }, 1000);

    return () => clearTimeout(timer);
  }, [saveNote]);

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black rounded-lg p-6 max-w-md mx-4 shadow-lg">
        <h2 className="text-xl font-bold text-black">Saving changes...</h2>
      </div>
    </div>
  );
}
