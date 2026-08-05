/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Dark theme (navy) ──────────────────────────────────────────
        ink: {
          DEFAULT: '#0B0F1E',
          950: '#070A16',
          900: '#0B0F1E',
          800: '#111827',
          750: '#141D32',
          700: '#1A2340',
          600: '#1F2A4A',
          500: '#243255',
          border: '#2A3560',
          'border-light': '#3A4870',
        },
        // ── Light theme (cream/warm white) ─────────────────────────────
        cream: {
          DEFAULT: '#FAF8F3',
          50:  '#FDFCF9',
          100: '#FAF8F3',
          200: '#F4F0E6',
          300: '#EDE7D8',
          400: '#E0D9C8',
          border: '#D5CCBA',
        },
        // ── Brand: Gold/Amber ──────────────────────────────────────────
        gold: {
          DEFAULT: '#C9A84C',
          50:  '#FDF8EC',
          100: '#F8EDCC',
          200: '#F0D98A',
          300: '#E8C55C',
          400: '#D4A93E',
          500: '#C9A84C',
          600: '#B8912F',
          700: '#9A7620',
          800: '#7A5C18',
          glow: '#C9A84C40',
          soft: '#C9A84C18',
        },
        // ── Accent: Teal (kept for data viz) ──────────────────────────
        pulse: {
          DEFAULT: '#3FBFAD',
          soft: '#3FBFAD20',
        },
        // ── Semantic ───────────────────────────────────────────────────
        alert: {
          DEFAULT: '#E8615A',
          soft: '#E8615A18',
        },
        success: {
          DEFAULT: '#3DBF7A',
          soft: '#3DBF7A18',
        },
        warning: {
          DEFAULT: '#F5A623',
          soft: '#F5A62318',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      backgroundImage: {
        // Dark gradient backgrounds
        'dark-hero':   'radial-gradient(ellipse 80% 60% at 50% -10%, #1A2340 0%, #0B0F1E 60%)',
        'dark-radial': 'radial-gradient(ellipse 60% 80% at 80% 20%, #1A2340 0%, transparent 70%)',
        'gold-shine':  'linear-gradient(135deg, #C9A84C 0%, #E8C55C 40%, #B8912F 100%)',
        'gold-subtle': 'linear-gradient(135deg, #C9A84C22 0%, #C9A84C08 100%)',
        // Light gradient backgrounds
        'light-hero':  'radial-gradient(ellipse 80% 60% at 50% -10%, #EDE7D8 0%, #FAF8F3 60%)',
        // Sidebar gradient
        'sidebar-dark':  'linear-gradient(180deg, #111827 0%, #0B0F1E 100%)',
        'sidebar-light': 'linear-gradient(180deg, #FAF8F3 0%, #F4F0E6 100%)',
      },
      boxShadow: {
        'gold-sm':  '0 0 12px 0 #C9A84C30',
        'gold-md':  '0 0 24px 0 #C9A84C28',
        'gold-lg':  '0 0 48px 0 #C9A84C20',
        'card-dark':  '0 4px 24px 0 #00000060, inset 0 1px 0 #FFFFFF08',
        'card-light': '0 4px 16px 0 #00000012, 0 1px 0 0 #FFFFFF80',
        'glow-teal':  '0 0 16px 0 #3FBFAD30',
        'inset-top': 'inset 0 1px 0 0 #FFFFFF0A',
      },
      animation: {
        'pulse-draw':    'pulseDraw 2.4s ease-in-out infinite',
        'fade-in':       'fadeIn 0.4s ease-out',
        'slide-up':      'slideUp 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'shimmer':       'shimmer 2s linear infinite',
        'spin-slow':     'spin 8s linear infinite',
        'float':         'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseDraw: {
          '0%':   { strokeDashoffset: '220', opacity: '0.3' },
          '50%':  { strokeDashoffset: '0',   opacity: '1'   },
          '100%': { strokeDashoffset: '-220', opacity: '0.3' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to:   { opacity: '1', transform: 'translateX(0)'    },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center'  },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)'    },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
