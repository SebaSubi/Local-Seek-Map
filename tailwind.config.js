/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto_400Regular", "Roboto_700Bold"],
      },
      colors: {
        defaultBlue: "#1a253d",
        defaultGray: "#f8f8f8",
        defaultOrange: "#ff6c3d",
        defaultText: "#1a253d",
      },
    },
  },
  plugins: [],
};
