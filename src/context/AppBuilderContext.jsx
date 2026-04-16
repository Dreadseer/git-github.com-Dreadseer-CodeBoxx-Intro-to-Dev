// AppBuilderContext.jsx — Manages form state for Experience 2 (App Builder).
// Provides formData, updateField, and updateMessage to all steps, the preview, and the result screen.

"use client";

import { createContext, useContext, useState } from "react";
import { DEFAULT_THEME } from "@/data/themes";

// Create the context object
const AppBuilderContext = createContext(null);

// The default state a student starts with before filling anything in
const defaultFormData = {
  appTitle: "",
  buttonLabel: "",
  messages: ["", "", ""],
  themeColor: DEFAULT_THEME,
};

// Provider component — wraps the experience route so all children can access state
export function AppBuilderProvider({ children }) {
  const [formData, setFormData] = useState(defaultFormData);

  // Updates a single top-level field without overwriting the rest of the form data
  function updateField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  // Updates one message in the messages array by its index position (0, 1, or 2)
  function updateMessage(index, value) {
    setFormData((prev) => {
      const updatedMessages = [...prev.messages];
      updatedMessages[index] = value;
      return { ...prev, messages: updatedMessages };
    });
  }

  return (
    <AppBuilderContext.Provider value={{ formData, updateField, updateMessage }}>
      {children}
    </AppBuilderContext.Provider>
  );
}

// Custom hook — components call useAppBuilder() instead of useContext(AppBuilderContext)
export function useAppBuilder() {
  const context = useContext(AppBuilderContext);
  if (!context) {
    throw new Error("useAppBuilder must be used inside an AppBuilderProvider");
  }
  return context;
}
