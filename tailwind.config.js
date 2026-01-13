import { addDynamicIconSelectors } from "@iconify/tailwind";
import tailwindRtl from "tailwindcss-rtl";

/** @type {import('tailwindcss').Config} */
export default {
  safelist: [
    {
      pattern: /gradient-to-(.*)/,
    },
    {
      pattern: /from-(.*)/,
    },
    {
      pattern: /to-(.*)/,
    },
    {
      pattern: /via-(.*)/,
    },
    {
      pattern: /bg-gradient-(.*)/,
      variants: ["hover"],
    },
    {
      pattern:
        /(bg|text|border|hover:bg|hover:border|group-hover:text)-(blue|red|green|purple|yellow|pink|indigo|gray)-(300|400|500|600|700|800)/,
    },
    {
      pattern: /bg-(purple|blue|red)-900/,
    },
    {
      pattern: /text-(purple|blue|red)-500/,
    },
    {
      pattern: /border-(purple|blue|red)-600/,
    },
    {
      pattern: /shadow-(purple|blue|red)-600/,
    },
    {
      pattern: /icon-\[.*\]/,
    },
  ],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{html,js}",
  ],
  darkMode: ["selector", '[data-mode="dark"]'],
  theme: {
    extend: {
      screens: {
        "mobile-s": "320px",
        "mobile-m": "375px",
        "mobile-l": "425px",
        tablet: "768px",
      },
      colors: {
        gold: "#FFD700",
      },
    },
  },
  plugins: [addDynamicIconSelectors(), tailwindRtl],
};
