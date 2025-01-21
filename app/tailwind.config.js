import { preset as Core } from "@sk-web-gui/core";

/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: [
    "./*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@sk-web-gui/*/dist/**/*.js",
  ],
  darkMode: "class", // or 'media' or 'class'
  important: ".sk-cornerroot",
  corePlugins: {
    preflight: false,
  },

  blocklist: [],
  theme: {
    extend: {
      spacing: {
        assistanttop: "var(--sk-spacing-assistanttop)",
        assistantbottom: "var(--sk-spacing-assistantbottom)",
        assistantleft: "var(--sk-spacing-assistantleft)",
        assistantright: "var(--sk-spacing-assistantright)",
      },
      screens: {
        ismobile: "var(--sk-screens-ismobile)",
      },
      colors: {
        header: {
          background: "var(--sk-colors-header-background)",
          text: "var(--sk-colors-header-text)",
        },
        bubble: {
          surface: "var(--sk-colors-bubble-surface)",
          "surface-hover": "var(--sk-colors-bubble-surface-hover)",
          text: "var(--sk-colors-bubble-text)",
        },
        menu: {
          background: "var(--sk-colors-menu-background)",
          "background-hover": "var(--sk-colors-menu-background-hover)",
          foreground: "var(--sk-colors-menu-foreground)",
        },
        newquest: {
          surface: "var(--sk-colors-newquest-surface)",
          "surface-hover": "var(--sk-colors-newquest-surface-hover)",
          text: "var(--sk-colors-newquest-text)",
          "text-hover": "var(--sk-colors-newquest-text-hover)",
        },
      },
    },
  },
  presets: [
    Core({
      plugin: {
        cssBase: true,
        colors: [],
        components: ["AICornerModule"],
      },
    }),
  ],
};
