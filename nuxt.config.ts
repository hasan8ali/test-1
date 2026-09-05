export default defineNuxtConfig({
  compatibilityDate: '2025-09-01',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt'],

  css: ['~/assets/css/main.css'],

  components: [{ path: '~/components', pathPrefix: false }],

  runtimeConfig: {
    jwtSecret: process.env.TOLNERA_JWT_SECRET || 'dev-secret-change-in-production',
    jwtExpiresIn: '7d',
    public: {
      siteName: 'Tolnera'
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap'
        }
      ]
    }
  },

  ui: {
    colors: {
      primary: 'lime',
      neutral: 'zinc'
    }
  },

  typescript: { strict: true },

  nitro: {
    externals: { external: ['better-sqlite3'] }
  }
})
