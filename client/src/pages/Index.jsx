import { app } from "../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";

export default function Index() {
  const [error, setError] = useState("");

  const handleStartNow = async () => {
    setError("");
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 font-[Montserrat,sans-serif] overflow-hidden">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center min-h-[8rem] flex flex-col items-center gap-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white text-black border border-black text-base font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 mr-2 flex-shrink-0"
              style={{ display: "inline-block", verticalAlign: "middle" }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Collaborative Notes, Simplified
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-[800px] mx-auto">
            Work Smarter, Together. Effortless Collaboration.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tag your notes, collaborate instantly, and generate on-demand AI
            summaries. No clutter. Just fast, secure, and focused writing.
          </p>
          <button
            className="bg-black hover:bg-gray-700 text-white font-semibold px-8 py-3 text-lg rounded-lg transition-colors duration-200 cursor-pointer"
            onClick={handleStartNow}
          >
            Start Now
          </button>
          {error && (
            <div className="mt-4 text-base text-red-600 bg-white border border-red-400 rounded p-4 max-w-md mx-auto">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
