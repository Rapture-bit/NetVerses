import { addDynamicIconSelectors, addIconSelectors } from "@iconify/tailwind";
import tailwindRtl from "tailwindcss-rtl";

/** @type {import('tailwindcss').Config} */
export default {
  safelist: [
    {
      pattern: /bg-(.*)-(500|600|700|800|900)/,
      variants: ["hover"],
    },
    {
      pattern: /text-(.*)-(500|600|700|800|900)/,
      variants: ["hover"],
    },
    {
      pattern: /border-(.*)-(500|600|700|800|900)/,
      variants: ["hover"],
    },
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
