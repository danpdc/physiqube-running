/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Using class strategy for dark mode
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        dark: {
          background: '#0E0E10',
          card: '#1C1C1E',
        },
        // Light mode colors
        light: {
          background: '#F9FAFB',
          card: '#FFFFFF',
        },
        // Brand colors
        primary: '#00C6A2',
        secondary: '#0081F1',
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          light: {
            primary: '#111827',
            secondary: '#4B5563',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}