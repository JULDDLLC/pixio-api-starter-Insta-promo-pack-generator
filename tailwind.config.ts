import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // CSS variable-driven system for dynamic theming
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",

        // JULDD luxury palette (for direct use in Tailwind classes)
        juldd: {
  deep: "#0a0e1a",
  deepDark: "#070a13",
  deepLight: "#181c2b",
  gold: "#bfa14a",
  goldLight: "#ffd700",
  white: "#f5f5f5",
  muted: "#e5e7eb",
  mutedFg: "#b0b3c6",
  accent: "#bfa14a",
  accentFg: "#181c2b",
  destructive: "#e63946",
  border: "rgba(191, 161, 74, 0.15)",
  input: "rgba(255,255,255,0.08)",
  sidebar: "rgba(18, 22, 34, 0.95)",
  greenDark: "#2e362e",
  greenUltraDark: "#0e110d", // luxury deep dark green
  taupe: "#494532",          // luxury taupe
},
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'Geist',
          'Montserrat',
          'Segoe UI',
          'Arial',
          'sans-serif',
        ],
        serif: [
          'Playfair Display',
          'Georgia',
          'serif',
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        '2xl': "1.5rem",
        '3xl': "2rem",
        full: "9999px",
      },
      boxShadow: {
        luxury: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        "luxury-hover": "0 12px 40px 0 rgba(191, 161, 74, 0.18)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 0deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'juldd-gradient': 'linear-gradient(135deg, #0a0e1a 0%, #181c2b 100%)',
        'gold-gradient': 'linear-gradient(90deg, #bfa14a 0%, #ffd700 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 15px 0 rgba(191, 161, 74, 0.4)' },
          '50%': { boxShadow: '0 0 30px 5px rgba(191, 161, 74, 0.7)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "sway": "sway 8s ease-in-out infinite",
        "shimmer": "shimmer 8s ease-in-out infinite",
        "pulse": "pulse 3s ease-in-out infinite",
        "glow": "glow 4s ease-in-out infinite",
      },
    },
plugins: [animate],
};

export default config;

