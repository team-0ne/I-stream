/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./build/**/*.html",
    "./build/js/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif']
      },
      colors: {
        cyan: {
          DEFAULT: '#06B6D4',
          dark:    '#0891B2',
          light:   '#67E8F9'
        },
        navy: {
          950: '#030712',
          900: '#05071A',
          800: '#080C28',
          700: '#0D1235',
          600: '#131843',
          500: '#1A2156'
        }
      }
    }
  },
  plugins: []
}