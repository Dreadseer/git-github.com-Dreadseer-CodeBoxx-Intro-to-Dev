// WebPageContext.jsx — Manages form state for Experience 1 (Web Page Builder).
// Provides formData and updateField to all steps, the preview, and the result screen.

"use client";

import { createContext, useContext, useState } from "react";
import { DEFAULT_THEME } from "@/data/themes";
import { DEFAULT_AVATAR } from "@/data/avatars";

// Create the context object
const WebPageContext = createContext(null);

// The default state a student starts with before filling anything in
const defaultFormData = {
  name: "",
  dreamJob: "",
  bio: "",
  themeColor: DEFAULT_THEME,
  avatar: DEFAULT_AVATAR,
};

// Provider component — wraps the experience route so all children can access state
export function WebPageProvider({ children }) {
  const [formData, setFormData] = useState(defaultFormData);

  // Updates a single field without overwriting the rest of the form data
  function updateField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <WebPageContext.Provider value={{ formData, updateField }}>
      {children}
    </WebPageContext.Provider>
  );
}

// Custom hook — components call useWebPage() instead of useContext(WebPageContext)
export function useWebPage() {
  const context = useContext(WebPageContext);
  if (!context) {
    throw new Error("useWebPage must be used inside a WebPageProvider");
  }
  return context;
}
