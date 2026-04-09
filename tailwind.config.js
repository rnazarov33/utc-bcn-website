/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#635BFF',
          dark: '#5249E5',
          light: '#8884FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        sansEn: ['Inter', 'system-ui', 'sans-serif'],
        sansUk: ['Onest', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
