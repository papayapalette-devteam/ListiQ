/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1526',
          light: '#1A2540',
        },
        brand: {
          DEFAULT: '#F97316',
          dark: '#C2570E',
          light: '#FFF5EE',
        },
        amazon: {
          DEFAULT: '#FF9900',
          light: '#FFF8EE',
          dark: '#A85F00',
        },
        flipkart: {
          DEFAULT: '#2874F0',
          light: '#EEF4FF',
          dark: '#1553BD',
        },
        meesho: {
          DEFAULT: '#9B2482',
          light: '#F9EEFF',
          dark: '#6E1A5C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
