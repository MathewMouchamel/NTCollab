import '../styles/index.css';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 font-[Montserrat,sans-serif] overflow-hidden">
      {/* Upload Section Only - Centered */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center min-h-[8rem]">
          <div className="mb-8 inline-flex items-center px-3 py-1 rounded-full bg-white text-black border border-black text-sm font-medium">
            {/* Star icon placeholder */}
            <span className="h-3 w-3 mr-1 inline-block align-middle">★</span>
            AI-Powered Resume Analysis
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Get Your Resume
            <span className="block pb-2 text-black">
              Graded by AI
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Upload your resume and get instant, actionable feedback to improve
            your chances of landing your dream job. Our AI analyzes everything
            from formatting to content optimization.
          </p>
          <button
            className="mt-4 bg-black hover:bg-gray-700 text-white font-semibold px-8 py-3 text-lg rounded-lg transition-colors duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
} 