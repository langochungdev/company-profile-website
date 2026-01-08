/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626',
          dark: '#B91C1C',
          light: '#EF4444',
        },
        secondary: {
          DEFAULT: '#111111',
          light: '#1F1F1F',
        },
        accent: '#F87171',
        dark: '#0A0A0A',
        light: '#FFFFFF',
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          light: '#F5F5F5',
          DEFAULT: '#6B7280',
          dark: '#374151'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
}
