/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'media', // This enables system-based dark mode
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
