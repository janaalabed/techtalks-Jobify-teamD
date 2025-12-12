/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],

  safelist: [
    // Hover background colors (300 — perfect balanced)
    "bg-blue-300",
    "bg-green-300",
    "bg-purple-300",
    "bg-yellow-300",

    "hover:bg-blue-300",
    "hover:bg-green-300",
    "hover:bg-purple-300",
    "hover:bg-yellow-300",

    // Icon strong colors (500)
    "text-blue-500",
    "text-green-500",
    "text-purple-500",
    "text-yellow-500",
  ],

  theme: {
    extend: {},
  },

  plugins: [],
};
