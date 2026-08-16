/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          bg: '#05051F',
          surface: '#10142D',
          card: '#1B1F3B',
          cardHover: '#24284B',
          border: '#2A2F54',
          borderLight: '#383E6E',
          green: '#16E875',
          greenHover: '#13C763',
          greenDark: '#0D4024',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          danger: '#EF4444',
          dangerBg: 'rgba(239, 68, 68, 0.15)',
          warning: '#F59E0B',
          warningBg: 'rgba(245, 158, 11, 0.15)',
          muted: '#A7ADC2',
          text: '#FFFFFF',
          sidebar: '#0A0D24',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(22, 232, 117, 0.25)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.25)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.25)',
        'card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}
