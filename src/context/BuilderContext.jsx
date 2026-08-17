// BuilderContext.jsx — Single state provider for both build paths.
// Mounted once per experience segment with that experience's config.
// Persists to sessionStorage so a locked phone or refresh doesn't lose the build.

"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { WIDGET_TYPES } from "@/data/widgets";

const BuilderContext = createContext(null);

export function BuilderProvider({ experience, children }) {
  const [formData, setFormData] = useState(experience.defaults);

  // Fields the user has actively set — drives the honest build percentage
  const [touched, setTouched] = useState([]);

  // Every meaningful choice increments this — shown as the DECISIONS counter
  const [decisions, setDecisions] = useState(0);

  // True once sessionStorage has been checked; result-page guards wait for this
  const [hydrated, setHydrated] = useState(false);

  const storageKey = experience.storageKey;
  const skipNextSave = useRef(true);

  // Restore a saved build for this visit, if one exists
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData({ ...experience.defaults, ...parsed.formData });
        setTouched(parsed.touched || []);
        setDecisions(parsed.decisions || 0);
      }
    } catch {
      // Corrupt or unavailable storage — start fresh
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Save on every change after hydration
  useEffect(() => {
    if (!hydrated) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ formData, touched, decisions })
      );
    } catch {
      // Storage full or blocked — the in-memory session still works
    }
  }, [formData, touched, decisions, hydrated, storageKey]);

  function markTouched(key) {
    setTouched((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  // Updates a single field without overwriting the rest of the form data
  function updateField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value, lastChanged: key }));
    markTouched(key);
    setDecisions((d) => d + 1);
  }

  // Updates one message in the messages array by its index position
  function updateMessage(index, value) {
    setFormData((prev) => {
      const updatedMessages = [...prev.messages];
      updatedMessages[index] = value;
      return { ...prev, messages: updatedMessages, lastChanged: "messages" };
    });
    markTouched("messages");
    setDecisions((d) => d + 1);
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
    setDecisions((d) => d + 1);
  }

  // Removes a widget by its unique id
  function removeWidget(id) {
    setFormData((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.id !== id),
    }));
    setDecisions((d) => d + 1);
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
    setDecisions((d) => d + 1);
  }

  // Moves a widget to a different placement slot
  function moveWidget(id, newPosition) {
    setFormData((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, position: newPosition } : w
      ),
    }));
    setDecisions((d) => d + 1);
  }

  // Clears the build for a fresh run (Rebuild action on the result screen)
  function resetBuild() {
    setFormData(experience.defaults);
    setTouched([]);
    setDecisions(0);
    try {
      sessionStorage.removeItem(storageKey);
      sessionStorage.removeItem(`${storageKey}_step`);
    } catch {
      // Ignore storage errors
    }
  }

  // Build percentage: required fields fill 0–90%, the last 10% lands at launch.
  // "messages" counts only when every message has content.
  const required = experience.requiredFields;
  const filled = required.filter((key) => {
    if (key === "messages") {
      return formData.messages?.every((m) => m.trim() !== "");
    }
    if (typeof formData[key] === "string" && formData[key].trim() === "") {
      return false;
    }
    // Defaulted choices (theme, avatar) count once the user touches them
    return touched.includes(key) || (formData[key] && !experience.defaults[key]);
  });
  const buildPercent = Math.round((filled.length / required.length) * 90);

  return (
    <BuilderContext.Provider
      value={{
        experience,
        formData,
        decisions,
        buildPercent,
        hydrated,
        updateField,
        updateMessage,
        addWidget,
        removeWidget,
        updateWidget,
        moveWidget,
        resetBuild,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

// Custom hook — components call useBuilder() instead of useContext(BuilderContext)
export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used inside a BuilderProvider");
  }
  return context;
}
