import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1FA45B',
          dark: '#168A4D',
          light: '#E8F5EE',
        },
        secondary: {
          DEFAULT: '#868686',
          dark: '#6B6B6B',
          light: '#F7F8FA',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        meQuran: ['Me Quran', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
