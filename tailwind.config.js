/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Classical Music Theme - Warm & Sophisticated
        'bg-dark': '#1a1a1f',
        'bg-secondary': '#252528',
        'cream': '#f5f0e8',
        'warm-gray': '#a8a29e',
        'gold': '#c9a962',
        'gold-light': '#d9bc72',
        'icon-color': '#a8a29e',
        primary: '#1a1a1f',
        secondary: '#252528',
        highlight: '#c9a962',
        text: '#f5f0e8',
      },
      fontFamily: {
        // Classical Typography
        'serif': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'sans': ['Lato', 'system-ui', 'sans-serif'],
        'heading': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'body': ['Lato', 'system-ui', 'sans-serif'],
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
      },
      boxShadow: {
        // Subtle, elegant shadows - no glow
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.2)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.25)',
      },
      keyframes: {
        // Soft, elegant animations only
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse': 'pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
