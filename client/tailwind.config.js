/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "node_modules/flowbite-react/lib/esm/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#EE2737",
        secondary: "#AF272F",
        dark: "#101820",
        gray: "#182430",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      container: {
        center: true,
        screens: {
          sm: "640px",
          md: "768px",
          lg: "992px",
          xl: "1200px",
          "2xl": "1600px",
        },
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "0px",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
