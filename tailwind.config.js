/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2D5A27',
          400: '#387030',
          500: '#2D5A27',
          600: '#23461e',
        },
        gold: {
          DEFAULT: '#C5A059',
          400: '#d1b378',
          500: '#C5A059',
          600: '#ab8a4c',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e5eee5',
          200: '#cddbcd',
          300: '#a7c1a7',
          400: '#7fa17f',
          500: '#608560',
          600: '#4a694a',
          700: '#3d543d',
          800: '#334433',
          900: '#2a392a',
        },
        terracotta: {
          50: '#fdf6f5',
          100: '#fbf0ed',
          200: '#f4dbd4',
          300: '#ecbeb2',
          400: '#e19886',
          500: '#d5765f',
          600: '#c55e46',
          700: '#a54b37',
          800: '#894030',
          900: '#72372a',
        },
        sand: {
          50: '#fcfbf9',
          100: '#f8f5f0',
          200: '#efebe1',
          300: '#e1dacb',
          400: '#ccc0ab',
          500: '#b7a48a',
          600: '#a48c6f',
          700: '#897259',
          800: '#715e4c',
          900: '#5e4e40',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
