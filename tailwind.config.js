/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./public/**/*.js",
    "./src/**/*.js"
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#667eea',
        secondary: '#764ba2'
      }
    },
  },
  plugins: [],
}
