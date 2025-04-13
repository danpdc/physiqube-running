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
        },
        card: {
          DEFAULT: 'var(--card)',
          border: 'var(--card-border)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
}