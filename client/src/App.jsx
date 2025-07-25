import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Index from "./pages/Index";
import Notes from "./pages/Notes";
import NoteEditor from "./pages/NoteEditor";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:id" element={<NoteEditor />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
