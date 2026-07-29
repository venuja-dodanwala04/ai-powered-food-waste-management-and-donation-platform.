import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        danger: 'hsl(var(--danger))',
        ocean: 'hsl(var(--ocean))',
        moss: 'hsl(var(--moss))',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.35rem',
      },
      boxShadow: {
        glow: '0 20px 60px rgba(14, 78, 53, 0.25)',
      },
      backgroundImage: {
        'app-radial':
          'radial-gradient(circle at top, rgba(37, 99, 235, 0.18), transparent 30%), radial-gradient(circle at 80% 10%, rgba(16, 185, 129, 0.16), transparent 20%), linear-gradient(180deg, rgba(7, 11, 24, 0.96), rgba(4, 24, 34, 0.98))',
      },
    },
  },
  plugins: [],
} satisfies Config;
