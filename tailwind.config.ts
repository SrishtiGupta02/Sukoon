import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDFCFB",
          100: "#FAF8F5",
          200: "#F3EFEA",
          300: "#E6DFD5",
          400: "#D2C7B8",
        },
        sukoon: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
          950: "#082F2C",
        },
        sand: {
          700: "#57534E",
          800: "#44403C",
          900: "#1C1917",
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(19, 78, 74, 0.06), 0 2px 6px -1px rgba(19, 78, 74, 0.04)",
        elevated: "0 12px 32px -4px rgba(19, 78, 74, 0.12), 0 4px 12px -2px rgba(19, 78, 74, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
