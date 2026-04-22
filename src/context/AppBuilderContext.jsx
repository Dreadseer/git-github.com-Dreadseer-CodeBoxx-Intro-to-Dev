// AppBuilderContext.jsx — Manages form state for Experience 2 (App Builder).
// Provides formData, updateField, updateMessage, and all widget methods to steps, preview, and result.

"use client";

import { createContext, useContext, useState } from "react";
import { DEFAULT_THEME } from "@/data/themes";
import { WIDGET_TYPES } from "@/data/widgets";

// Create the context object
const AppBuilderContext = createContext(null);

// The default state a student starts with before filling anything in
const defaultFormData = {
  appTitle: "",
  buttonLabel: "",
  messages: ["", "", ""],
  themeColor: DEFAULT_THEME,
  widgets: [],
  lastChanged: null,
};

// Provider component — wraps the experience route so all children can access state
export function AppBuilderProvider({ children }) {
  const [formData, setFormData] = useState(defaultFormData);

  // Updates a single top-level field without overwriting the rest of the form data
  function updateField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value, lastChanged: key }));
  }

  // Updates one message in the messages array by its index position (0, 1, or 2)
  function updateMessage(index, value) {
    setFormData((prev) => {
      const updatedMessages = [...prev.messages];
      updatedMessages[index] = value;
      return { ...prev, messages: updatedMessages, lastChanged: "messages" };
    });
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
    <AppBuilderContext.Provider value={{ formData, updateField, updateMessage, addWidget, removeWidget, updateWidget, moveWidget }}>
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
