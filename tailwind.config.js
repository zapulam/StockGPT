/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a192f',
          800: '#112240',
          700: '#233554',
          600: '#2c3e50',
          500: '#3a506b',
        },
        forest: {
          900: '#014421',
          800: '#14532d',
          700: '#166534',
          600: '#15803d',
          500: '#22c55e',
        },
        primary: '#112240', // navy
        secondary: '#14532d', // forest green
        dark: {
          900: '#0a192f',
          800: '#112240',
          700: '#233554',
          600: '#2c3e50',
          500: '#3a506b',
          400: '#3d3d3d',
          300: '#525252',
          200: '#a1a1a1',
          100: '#cfcfcf',
        },
      },
    },
  },
} 