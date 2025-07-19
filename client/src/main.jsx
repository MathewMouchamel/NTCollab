import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Documents from "./pages/Documents.jsx";
import { AuthProvider } from "./AuthContext";
import { Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/documents" element={<Documents />} />
</Routes>;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Index />
        <Documents />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
