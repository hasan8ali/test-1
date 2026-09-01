import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'Inter', 'Tajawal', 'system-ui', 'sans-serif'],
        serif: ['Amiri', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcdcff',
          300: '#8ec5ff',
          400: '#59a6ff',
          500: '#2f88ff',
          600: '#1768f0',
          700: '#1252d4',
          800: '#1544ab',
          900: '#173a87'
        }
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(0,0,0,0.08), 0 4px 16px -4px rgba(0,0,0,0.06)',
        'softer': '0 1px 3px -1px rgba(0,0,0,0.06), 0 2px 8px -2px rgba(0,0,0,0.04)',
        'floating': '0 12px 32px -8px rgba(0,0,0,0.18), 0 4px 12px -4px rgba(0,0,0,0.08)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
