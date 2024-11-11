/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {},
      // width: {
      //   128: "32rem",
      // },
    },
  },
  plugins: [],
};

export default tailwindConfig;
