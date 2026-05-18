import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand palette — work in both light & dark
        brand: {
          DEFAULT: '#0f172a',
          accent: '#d97706', // amber
        },
        // Custom sage/cream palette inspired by reference
        sage: {
          50: '#f4f5f1',
          100: '#e6e8df',
          200: '#cdd1c0',
          300: '#a8b194',
          400: '#8a9778',
          500: '#6f7d5e',
          600: '#576349',
          700: '#46503c',
          800: '#3a4133',
          900: '#33372d',
        },
        cream: {
          50: '#fbf8f1',
          100: '#f4ecd8',
          200: '#e8dcb8',
          300: '#dbc796',
        },
        ink: {
          50: '#f8fafc',
          900: '#0a0e14',
          950: '#05080d',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans, system-ui)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
