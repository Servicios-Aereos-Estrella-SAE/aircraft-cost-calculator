// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxt/eslint'],
  app: {
    head: {
      charset: 'utf-8',
      title: 'SAE - Sistema de Proyección para Aeronaves',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0',
      htmlAttrs: {
        lang: 'es',
        translate: 'no',
      },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap' },
        { rel: 'icon', type: 'image/x-icon', href: '/isotipo.webp' }
      ]
    }
  },
})