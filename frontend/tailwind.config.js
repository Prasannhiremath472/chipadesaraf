/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        crimson: {
          50:  '#fdf2f6',
          100: '#fce7ef',
          200: '#f9cfe0',
          300: '#f4a7c3',
          400: '#ec6f9a',
          500: '#e04478',
          600: '#cc2460',
          700: '#a8174d',
          800: '#8B1A4A',
          900: '#6b1238',
          950: '#420b22',
        },
        gold: {
          50:  '#fdfbf3',
          100: '#faf4e0',
          200: '#f4e5ba',
          300: '#ead08a',
          400: '#ddb558',
          500: '#C8963C',
          600: '#b07830',
          700: '#8f5e27',
          800: '#6e4820',
          900: '#4e3317',
        },
        brand: {
          crimson: '#8B1A4A',
          gold:    '#C8963C',
          dark:    '#1a0a0f',
          cream:   '#FDF8F0',
          muted:   '#f5e6d3',
        },
      },
      fontFamily: {
        serif:     ['Playfair Display', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:      ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'crimson-gold': 'linear-gradient(135deg, #8B1A4A 0%, #6b1238 50%, #420b22 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #C8963C 0%, #e8c06a 40%, #C8963C 70%, #a07030 100%)',
        'dark-rich':    'linear-gradient(160deg, #1a0a0f 0%, #2d0f1f 50%, #1a0a0f 100%)',
      },
      animation: {
        'marquee':    'marquee 30s linear infinite',
        'shimmer':    'shimmer 2s ease-in-out infinite',
        'float':      'float 4s ease-in-out infinite',
        'fade-up':    'fadeUp 0.6s ease forwards',
        'gold-pulse': 'goldPulse 2s ease-in-out infinite',
      },
      keyframes: {
        marquee:   { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        shimmer:   { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        fadeUp:    { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        goldPulse: { '0%,100%': { boxShadow: '0 0 0 0 rgba(200,150,60,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(200,150,60,0)' } },
      },
      boxShadow: {
        'gold':    '0 4px 24px rgba(200,150,60,0.25)',
        'gold-lg': '0 8px 48px rgba(200,150,60,0.35)',
        'crimson': '0 4px 24px rgba(139,26,74,0.30)',
        'deep':    '0 8px 32px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
