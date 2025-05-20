/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00f3ff',
        'neon-pink': '#ff00a0',
        'neon-yellow': '#ffff00',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'neon-blue': '0 0 5px rgba(0, 243, 255, 0.5), 0 0 20px rgba(0, 243, 255, 0.3)',
        'neon-pink': '0 0 5px rgba(255, 0, 160, 0.5), 0 0 20px rgba(255, 0, 160, 0.3)',
        'neon-yellow': '0 0 5px rgba(255, 255, 0, 0.5), 0 0 20px rgba(255, 255, 0, 0.3)',
      },
    },
  },
  plugins: [],
};