/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        coachGreen: "#1D9E75",
        coachGreenBg: "#E1F5EE",
        insightPurple: "#7F77DD",
        insightPurpleBg: "#EEEDFE",
        comebackCoral: "#D85A30",
        comebackCoralBg: "#FAECE7",
        textPrimary: "#1A1A1A",
        textSecondary: "#6B6B6B",
        background: "#F8F8F6",
        card: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
