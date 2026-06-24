/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan HTML + JS so dynamically-toggled classes (e.g. the form's
  // bg-emerald-50 / bg-red-50 status states in main.js) aren't purged.
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "Inter", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd",
          400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8",
          800: "#1e40af", 900: "#1e3a8a", 950: "#172554",
        },
        ink: "#0b1220",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(15,23,42,.06), 0 12px 32px -12px rgba(15,23,42,.12)",
        lift: "0 20px 50px -20px rgba(29,78,216,.35)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: { floaty: "floaty 7s ease-in-out infinite" },
    },
  },
  plugins: [],
};
