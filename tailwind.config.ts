import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        stash: {
          blue: '#007AFF',
          red: '#FF3B30',
          orange: '#FF9500',
          yellow: '#FFCC00',
          green: '#34C759',
          teal: '#5AC8FA',
          purple: '#AF52DE',
          pink: '#FF2D55',
          gray: '#8E8E93',
          indigo: '#5856D6',
          cyan: '#00C7BE',
          coral: '#FF6482',
        },
        highlight: {
          yellow: 'rgba(255, 230, 0, 0.35)',
          blue: 'rgba(0, 122, 255, 0.2)',
          green: 'rgba(52, 199, 89, 0.25)',
          pink: 'rgba(255, 45, 85, 0.2)',
        },
        reader: {
          light: {
            bg: '#FFFFFF',
            text: '#1C1C1E',
            secondary: '#8E8E93',
          },
          dark: {
            bg: '#1C1C1E',
            text: '#E5E5E7',
            secondary: '#98989F',
          },
          sepia: {
            bg: '#F5F0E8',
            text: '#433422',
            secondary: '#8B7355',
          },
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      maxWidth: {
        reader: '680px',
      },
    },
  },
  plugins: [typography],
}

export default config
