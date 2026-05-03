"use client";

import { createContext, useContext, useState } from "react";

const WebPageContext = createContext(null);

const defaultState = {
  // Site-wide
  themeColor: "purple",
  fontPairing: "modern",

  // Hero (always on)
  name: "",
  tagline: "",
  avatar: "rocket",
  heroBackground: "gradient",
  ctaLabel: "Contact Me",
  ctaUrl: "",
  ctaEnabled: true,

  // Sections (toggleable)
  sections: {
    about: { enabled: true, heading: "About Me", bio: "" },
    skills: { enabled: true, heading: "My Skills", tags: [] },
    contact: {
      enabled: true,
      heading: "Get In Touch",
      email: "",
      github: "",
      instagram: "",
      linkedin: "",
    },
  },

  lastChanged: null,
};

export function WebPageProvider({ children }) {
  const [formData, setFormData] = useState(defaultState);

  // Update a top-level field (name, tagline, themeColor, etc.)
  function updateField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value, lastChanged: key }));
  }

  // Update a field inside a specific section
  function updateSection(sectionKey, fieldKey, value) {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          [fieldKey]: value,
        },
      },
      lastChanged: `${sectionKey}.${fieldKey}`,
    }));
  }

  // Toggle a section on or off
  function toggleSection(sectionKey) {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          enabled: !prev.sections[sectionKey].enabled,
        },
      },
      lastChanged: `${sectionKey}.enabled`,
    }));
  }

  // Add a skill tag to the skills section
  function addSkillTag(tag) {
    const trimmed = tag.trim();
    if (!trimmed) return;
    setFormData((prev) => {
      const existing = prev.sections.skills.tags;
      if (existing.includes(trimmed)) return prev;
      return {
        ...prev,
        sections: {
          ...prev.sections,
          skills: {
            ...prev.sections.skills,
            tags: [...existing, trimmed],
          },
        },
        lastChanged: "skills.tags",
      };
    });
  }

  // Remove a skill tag by value
  function removeSkillTag(tag) {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        skills: {
          ...prev.sections.skills,
          tags: prev.sections.skills.tags.filter((t) => t !== tag),
        },
      },
      lastChanged: "skills.tags",
    }));
  }

  return (
    <WebPageContext.Provider
      value={{
        formData,
        updateField,
        updateSection,
        toggleSection,
        addSkillTag,
        removeSkillTag,
      }}
    >
      {children}
    </WebPageContext.Provider>
  );
}

export function useWebPage() {
  const ctx = useContext(WebPageContext);
  if (!ctx) throw new Error("useWebPage must be used inside <WebPageProvider>");
  return ctx;
}
