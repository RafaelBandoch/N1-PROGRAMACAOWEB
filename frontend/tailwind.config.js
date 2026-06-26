/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/public/**/*.html",
    "./frontend/public/**/*.js"
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#0d9488',
        secondary: '#14b8a6'
      }
    },
  },
  plugins: [],
}
