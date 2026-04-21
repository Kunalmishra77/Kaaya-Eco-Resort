// d:/kaaya eco resort/client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#1B4332',
        olive:  '#4A7C59',
        sage:   '#8FAF91',
        sand:   '#C8A96E',
        terra:  '#C1440E',
        stone:  '#F5F0E8',
        timber: '#5C3D1E',
        lake:   '#B8D4E3',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, rgba(27,67,50,0.55) 0%, rgba(27,67,50,0.2) 50%, rgba(27,67,50,0.7) 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
