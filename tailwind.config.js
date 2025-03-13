/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "Arial"],
        mono: ["Roboto Mono", "Courier New"],
      },
      colors: {
        primary: "#FFC700",
        "primary-shadow": "rgba(103,81,0,0.1)",
        "primary-highlight": "#FFF3C8",
        shadow: "rgba(0,0,0,0.1)",
        secondary: "#FFFFFF",
        tertiary: "#675100",
        accent: "#AB8601",
        "accent-pink": "#FF005C",
        "accent-red": "#FF6F6F",
        "accent-blue": "#00B5EE",
        "accent-green": "#A6D60C",
        "accent-purple": "#C05CE8",
        "accent-turqoise": "#4FDDC5",
        "accent-orange": "#FF9F40",
      },
      spacing: {
        "top-element": "6rem",
        "h-small": "10vw",
      },
    },
  },
  plugins: [],
};
