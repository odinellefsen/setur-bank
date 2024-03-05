import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom colors here
        switch: {
          light: {
            bg: '#272729', // A light gray for the unchecked state background in light mode
            thumb: '#ffffff', // A lighter shade for the thumb in light mode
            checked: '#4f46e5', // A distinct color for the checked state in light mode (e.g., indigo)
          },
          dark: {
            bg: '#374151', // A dark gray for the unchecked state background in dark mode
            thumb: '#272729', // A darker shade for the thumb in dark mode
            checked: '#ffffff', // A lighter shade of the checked color for dark mode (e.g., lighter indigo)
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
