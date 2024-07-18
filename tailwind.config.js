/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        sonar: "sonar 0.5s linear",
        fadeIn: "fadeIn 0.3s ease-in",
      },
    },

    keyframes: {
      fadeIn: {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
      sonar: {
        "0%": { transform: "scale(1)", opacity: 0 },
        "50%": { opacity: 1 },
        "100%": { transform: "scale(4)", opacity: 0 },
      },
    },
  },
  plugins: [],
};
