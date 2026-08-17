// experiences.js — Central configuration for each build path.
// Missions, labels, defaults, and required fields live here so the flow,
// progress meter, and screens all render from one experience model.

import { DEFAULT_THEME } from "@/data/themes";
import { DEFAULT_AVATAR } from "@/data/avatars";

export const EXPERIENCES = {
  webpage: {
    key: "webpage",
    pathTag: "PATH A",
    title: "Creator Page",
    tagline: "A personal landing page, built around who you are.",
    route: "/experience/webpage",
    resultRoute: "/experience/webpage/result",
    storageKey: "cbx_build_webpage",
    defaults: {
      name: "",
      dreamJob: "",
      bio: "",
      themeColor: DEFAULT_THEME,
      avatar: DEFAULT_AVATAR,
      widgets: [],
      lastChanged: null,
    },
    // Mission track shown in BuildProgress — 3 build missions + launch
    missions: [
      { key: "identity", label: "IDENTITY", title: "Who is this page about?" },
      { key: "style", label: "STYLE", title: "Give it a voice and a color" },
      { key: "icon", label: "ICON", title: "Choose your mark" },
      { key: "launch", label: "LAUNCH" },
    ],
    // Fields that count toward build percentage (must be truthy / touched)
    requiredFields: ["name", "dreamJob", "bio", "themeColor", "avatar"],
  },

  app: {
    key: "app",
    pathTag: "PATH B",
    title: "Interactive App",
    tagline: "A working app that responds when people tap it.",
    route: "/experience/app",
    resultRoute: "/experience/app/result",
    storageKey: "cbx_build_app",
    defaults: {
      appTitle: "",
      buttonLabel: "",
      messages: ["", "", ""],
      themeColor: DEFAULT_THEME,
      widgets: [],
      lastChanged: null,
    },
    missions: [
      { key: "concept", label: "CONCEPT", title: "Name your app" },
      { key: "content", label: "CONTENT", title: "Write what it says" },
      { key: "style", label: "STYLE", title: "Pick its color" },
      { key: "launch", label: "LAUNCH" },
    ],
    requiredFields: ["appTitle", "buttonLabel", "messages", "themeColor"],
  },
};
