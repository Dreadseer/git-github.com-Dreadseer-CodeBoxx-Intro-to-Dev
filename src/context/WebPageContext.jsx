// WebPageContext.jsx — Manages form state for Experience 1 (Web Page Builder).
// Provides formData, updateField, and all widget methods to all steps, the preview, and result screen.

"use client";

import { createContext, useContext, useState } from "react";
import { DEFAULT_THEME } from "@/data/themes";
import { DEFAULT_AVATAR } from "@/data/avatars";
import { WIDGET_TYPES } from "@/data/widgets";

// Create the context object
const WebPageContext = createContext(null);

// The default state a student starts with before filling anything in
const defaultFormData = {
  name: "",
  dreamJob: "",
  bio: "",
  themeColor: DEFAULT_THEME,
  avatar: DEFAULT_AVATAR,
  widgets: [],
  lastChanged: null,
};

// Provider component — wraps the experience route so all children can access state
export function WebPageProvider({ children }) {
  const [formData, setFormData] = useState(defaultFormData);

  // Updates a single field without overwriting the rest of the form data
  function updateField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value, lastChanged: key }));
  }

  // Adds a new widget instance at the chosen position with default values
  function addWidget(type, position) {
    const widgetDef = WIDGET_TYPES.find((w) => w.key === type);
    const newWidget = {
      id: `widget_${Date.now()}`,
      type,
      position,
      values: { ...widgetDef.defaults },
    };
    setFormData((prev) => ({
      ...prev,
      lastChanged: { kind: "widget", widgetType: type, slot: position },
      widgets: [...prev.widgets, newWidget],
    }));
  }

  // Removes a widget by its unique id
  function removeWidget(id) {
    setFormData((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.id !== id),
    }));
  }

  // Updates a single value field on a widget instance
  function updateWidget(id, key, value) {
    setFormData((prev) => {
      const widget = prev.widgets.find((w) => w.id === id);
      return {
        ...prev,
        lastChanged: widget
          ? { kind: "widget", widgetType: widget.type, slot: widget.position }
          : prev.lastChanged,
        widgets: prev.widgets.map((w) =>
          w.id === id ? { ...w, values: { ...w.values, [key]: value } } : w
        ),
      };
    });
  }

  // Moves a widget to a different placement slot
  function moveWidget(id, newPosition) {
    setFormData((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, position: newPosition } : w
      ),
    }));
  }

  return (
    <WebPageContext.Provider value={{ formData, updateField, addWidget, removeWidget, updateWidget, moveWidget }}>
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
