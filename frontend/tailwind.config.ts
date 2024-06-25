import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        showContent: {
          to: {
            transform: "translateY(0)",
            filter: "blur(0)",
            opacity: "1",
          },
        },
      },
      colors: {
        lama: "#F35C7A",
        primary: "#fea928",
        secondary: "#ed8900",
        whiteText: "#fff",
        darkText: "#000000",
        lightText: "#9b9b9b",
        greenText: "#1d8221",
        redText: "#E02B2B ",
        skyText: "#32BDE8",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "show-content": "showContent 0.5s 0.7s ease-in-out 1 forwards",
      },
<<<<<<< HEAD
=======
      flex: {
        full: "0 0 100%",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
>>>>>>> 65f28f00738ef8604e4cc0851d84203935f669c6
    },
  },
  plugins: [
    require("tailwindcss-animation-delay"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
export default config;
