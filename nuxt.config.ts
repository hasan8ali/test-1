// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-09-01',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  // Disable path prefix so components in subdirs keep their declared name
  // e.g. components/blocks/BlockFaq.vue resolves to <BlockFaq>, not <BlocksBlockFaq>
  components: [
    { path: '~/components', pathPrefix: false }
  ],

  // SQLite database path — relative to project root
  runtimeConfig: {
    databasePath: './data/tolnera.db',
    public: {
      siteName: 'Tolnera Builder',
      siteDescription: 'محرر صفحات وثيمات — مشروع مستقل لمنصة Tolnera'
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
          href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Amiri:wght@400;700&family=Tajawal:wght@300;400;500;700;800;900&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Reem+Kufi:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },

  // Nuxt UI v4 design tokens (Tailwind v4)
  ui: {
    colors: {
      primary: 'indigo',
      secondary: 'violet',
      success: 'emerald',
      info: 'sky',
      warning: 'amber',
      error: 'rose',
      neutral: 'slate'
    }
  },

  typescript: { strict: true },

  nitro: {
    // Native modules must stay external (not bundled)
    externals: {
      external: ['better-sqlite3']
    },
    rollupConfig: {
      output: {
        inlineDynamicImports: false
      }
    }
  }
})
