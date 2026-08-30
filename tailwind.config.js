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
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36a9f6',
          500: '#0c8de4',
          600: '#026fc1',
          700: '#03589c',
          800: '#074b80',
          900: '#0c3f6a',
          950: '#082846',
        },
        dept: {
          engineering: '#3b82f6', // blue
          design: '#ec4899',      // pink
          product: '#8b5cf6',     // purple
          marketing: '#f59e0b',   // amber
          sales: '#10b981',       // emerald
          hr: '#06b6d4',          // cyan
          finance: '#6366f1',     // indigo
          operations: '#64748b',  // slate
          executive: '#e11d48'    // rose
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(139, 92, 246, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
