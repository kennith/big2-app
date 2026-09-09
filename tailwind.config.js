/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        table: {
          felt: '#1a472a',
          dark: '#0f2918',
          light: '#2d6a4f',
          border: '#38220f',
          wood: '#5c3a21',
          gold: '#d4af37'
        }
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
        'card-selected': '0 0 0 3px #f59e0b, 0 12px 20px -3px rgba(0, 0, 0, 0.4)',
        'felt-inner': 'inset 0 0 100px rgba(0, 0, 0, 0.6)'
      },
      keyframes: {
        'deal-in': {
          '0%': { transform: 'scale(0.5) translateY(-50px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' }
        },
        'play-card': {
          '0%': { transform: 'scale(0.8) translateY(40px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(234, 179, 8, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(234, 179, 8, 0.8)' }
        }
      },
      animation: {
        'deal': 'deal-in 0.3s ease-out forwards',
        'play': 'play-card 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'glow': 'pulse-glow 2s infinite'
      }
    },
  },
  plugins: [],
}
