// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    '~/assets/css/main.css'
  ],
  app: {
    head: {
      title: 'Nuxt Word Editor — محرر نصوص عصري',
      htmlAttrs: {
        lang: 'ar',
        dir: 'rtl'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'محرر نصوص عصري مبني على Nuxt.js و TipTap — بكل المميزات' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Amiri:wght@400;700&family=Tajawal:wght@300;400;500;700;800&display=swap'
        }
      ]
    }
  }
})
