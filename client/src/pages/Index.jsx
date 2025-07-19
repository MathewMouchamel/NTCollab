import '../styles/index.css';

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6 bg-white border-4 border-black rounded-xl p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-black mb-2">Something went wrong</h1>
              <p className="text-black mb-4">
                The application encountered an unexpected error. Please try refreshing the page.
              </p>
              {this.state.error && (
                <details className="text-left text-sm text-black">
                  <summary className="cursor-pointer font-semibold">Error Details</summary>
                  <pre className="mt-2 text-xs overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-black hover:bg-gray-700 text-white font-semibold px-8 py-3 text-lg rounded-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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