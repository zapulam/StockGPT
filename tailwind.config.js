/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a192f',
          800: '#112240',
          700: '#233554',
          600: '#2c3e50',
          500: '#3a506b',
        },
        forest: {
          900: '#014421',
          800: '#14532d',
          700: '#166534',
          600: '#15803d',
          500: '#22c55e',
        },
        primary: '#112240', // navy
        secondary: '#14532d', // forest green
        dark: {
          900: '#0a192f',
          800: '#112240',
          700: '#233554',
          600: '#2c3e50',
          500: '#3a506b',
          400: '#3d3d3d',
          300: '#525252',
          200: '#a1a1a1',
          100: '#cfcfcf',
        },
        // Modern gradient colors
        gradient: {
          blue: {
            from: '#3b82f6',
            to: '#1d4ed8',
          },
          purple: {
            from: '#8b5cf6',
            to: '#7c3aed',
          },
          emerald: {
            from: '#10b981',
            to: '#059669',
          },
          orange: {
            from: '#f97316',
            to: '#ea580c',
          },
          red: {
            from: '#ef4444',
            to: '#dc2626',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-forest': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.5)',
        'glow-xl': '0 0 60px rgba(59, 130, 246, 0.7)',
        'inner-glow': 'inset 0 0 20px rgba(59, 130, 246, 0.2)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    // Custom plugin for glassmorphism
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} 