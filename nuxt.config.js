import { resolve } from 'path'

export default {
  ssr: false,
  target: 'static',
  head: {
    title: 'syrup-stocks',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  alias: {
    '~global': resolve(__dirname, './components/global'),
    '~icons': resolve(__dirname, './components/global/SIcon')
  },
  css: [
    '@/assets/scss/global.scss'
  ],
  components: false,
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/stylelint-module'
  ],
  generate: {
    interval: 2000
  }
}
