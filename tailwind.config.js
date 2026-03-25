import theme from "./src/constants/theme.js";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        "background-light": theme.colors.background.light,
        "background-dark": theme.colors.background.dark,
        slate: theme.colors.slate,
        emerald: theme.colors.emerald,
      },
      fontFamily: {
        display: theme.fonts.display,
      },
    },
  },
  plugins: [],
};
