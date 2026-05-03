/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2dd8a3',
          50: '#eafff7',
          100: '#cbffeb',
          200: '#9cffdb',
          300: '#5bfcc6',
          400: '#2dd8a3',
          500: '#05c08a',
          600: '#009c71',
          700: '#007d5c',
          800: '#03634b',
          900: '#04513f',
        },
        dark: {
          DEFAULT: '#1a1f2e',
          50: '#f6f6f9',
          100: '#ececf2',
          200: '#d5d6e2',
          300: '#b0b2c8',
          400: '#8588a9',
          500: '#666a8f',
          600: '#525476',
          700: '#434560',
          800: '#3a3b51',
          900: '#1a1f2e',
          950: '#111422',
        },
        danger: '#ef4444',
        warning: '#f59e0b',
        background: '#f4f6f9',
        'text-primary': '#1e293b',
        'text-secondary': '#64748b',
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1e2235',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        badge: '999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        glow: '0 0 20px rgba(45, 216, 163, 0.15)',
        'dark-card': '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
        'dark-card-hover': '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        slideIn: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
