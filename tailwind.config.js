/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FDF8F0",
        ink: "#241F1A",
        accent: {
          DEFAULT: "#8B7CF6",
          light: "#EDE8FF",
        },
        washi: "#D8CFC0",
      },
      fontFamily: {
        display: ["Fraunces_600SemiBold"],
        hand: ["PatrickHand_400Regular"],
        body: ["Inter_400Regular"],
        "body-medium": ["Inter_500Medium"],
      },
    },
  },
  plugins: [],
};
