import React from "react";

export default function Documents() {
  // Placeholder for documents array
  const documents = [];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold mb-10 tracking-tight">Documents</h1>
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          {/* Fun black/white SVG (document with a smiley face) */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-6"
          >
            <rect
              x="20"
              y="20"
              width="80"
              height="100"
              rx="12"
              fill="#fff"
              stroke="#000"
              strokeWidth="4"
            />
            <circle cx="45" cy="60" r="5" fill="#000" />
            <circle cx="75" cy="60" r="5" fill="#000" />
            <path
              d="M50 80 Q60 90 70 80"
              stroke="#000"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-xl font-semibold mb-6 text-center">
            No documents yet!
            <br />
            Click below to create your first one.
          </p>
          <button
            className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-200 shadow-lg"
            aria-label="Add new document"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {/* Map over documents here in the future */}
          {/* Example: documents.map(doc => <DocumentCard key={doc.id} ... />) */}
          <button
            className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-200 shadow-lg self-center mt-8"
            aria-label="Add new document"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
