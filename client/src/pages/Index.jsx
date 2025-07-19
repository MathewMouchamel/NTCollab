export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 font-[Montserrat,sans-serif] overflow-hidden">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center min-h-[8rem]">
          <div className="mb-8 inline-flex items-center px-3 py-1 rounded-full bg-white text-black border border-black text-sm font-medium flex items-center">
            <span className="h-3 w-3 mr-1 flex items-center justify-center">★</span>
            Collaborative Notes, Simplified
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-[700px] mx-auto">
            Work Smarter, Together. Effortless Collaboration.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Tag your notes, collaborate instantly, and generate on-demand AI summaries to capture the big picture. No clutter. Just fast, secure, and focused writing.
          </p>
          <button
            className="mt-4 bg-black hover:bg-gray-700 text-white font-semibold px-8 py-3 text-lg rounded-lg transition-colors duration-200"
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
} 