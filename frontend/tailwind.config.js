/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        obsidian: '#080808',
        carbon: '#0e0e0e',
        graphite: '#161616',
        zinc: {
          750: '#2a2a2a',
          850: '#1a1a1a',
          925: '#111111',
        },
        accent: {
          DEFAULT: '#e8ff47',
          dim: '#b8cc2e',
          muted: 'rgba(232,255,71,0.12)',
        },
        frost: 'rgba(255,255,255,0.05)',
        'frost-md': 'rgba(255,255,255,0.08)',
        'frost-lg': 'rgba(255,255,255,0.12)',
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
