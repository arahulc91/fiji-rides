/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0EB981',
          light: '#4CD7A7',
          dark: '#0A8B61',
          50: '#E6F9F3',
          100: '#CCF3E7',
          200: '#99E7CF',
          300: '#66DBB7',
          400: '#33CF9F',
          500: '#0EB981',
          600: '#0B8A61',
          700: '#085C40',
          800: '#062D20',
          900: '#031610',
          950: '#010806',
        },
        secondary: {
          DEFAULT: '#0C111C',
          50: '#E7E8EA',
          100: '#CFD1D5',
          200: '#9BA0A8',
          300: '#676E7C',
          400: '#343D4F',
          500: '#0C111C',
          600: '#090D15',
          700: '#06080E',
          800: '#030407',
          900: '#010102',
          950: '#000000',
        },
        'content-primary': '#19AB6A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    function({ addBase }) {
      addBase({
        ':root': {
          '--tw-color-primary': '#0EB981',
          '--tw-color-primary-dark': '#0A8B61',
        },
      })
    },
  ],
}

