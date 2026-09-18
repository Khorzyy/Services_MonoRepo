/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff4ff",
          100: "#dbe7ff",
          200: "#b7ceff",
          300: "#8fb2ff",
          400: "#5d8cff",
          500: "#276aff",
          600: "#0052ff",
          700: "#003ecc",
          800: "#0034aa",
          900: "#002b8f",
        },
        surface: {
          DEFAULT: "#111827",
          soft: "#1F2937",
        },

        background: "#0F172A",

        text: {
          primary: "#F9FAFB",
          secondary: "#9CA3AF",
        },
      },
      borderRadius: {
        xl: "12px",
        "2xl": "24px",
      },
    },
  },
  plugins: [],
};
