module.exports = {
  mode: 'universal',
  server: {
    port: 3001, // default: 3000
    host: 'localhost', // default: localhost
  },
  /*
  ** Headers of the pages
  */
  head: {
    title: 'Secdra - 想你所想',
    meta: [
      {charset: 'utf-8'},
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'
      },
      {hid: 'application-name', name: 'application-name', content: "Secdra"},
      {hid: 'keywords', name: 'keywords', content: "secdra,pixiv,二次元,插画,开源项目"},
      {hid: 'description', name: 'description', content: "Secdra是一个采集pixiv为素材而开发的一个开源网站。目前还在优化更新中..."}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {rel: 'stylesheet', type: 'text/css', href: '//at.alicdn.com/t/font_896802_p65o52if5w.css'},
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  // loading: {
  //   name: 'nuxt',
  //   color: '#0b99ff',
  //   background: '#fff'
  // },
  loading: '~/components/Loading.vue',
  /*
  ** Global CSS
  */
  css: [
    {src: '../assets/style/index.less', lang: 'less'},
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/mixin',
    '~/plugins/extend',
  ],


  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/proxy',
    '@nuxtjs/axios'
  ],
  proxy: [
    [
      '/api',
      {
        target: "http://127.0.0.1:8080", // api主机
        secure: false,
        changeOrigin: true,
        pathRewrite: {'^/api': '/'}
      }
    ]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios'],
    postcss: {
      plugins: {
        "postcss-px-to-viewport": {
          viewportWidth: 500, // (Number) The width of the viewport.
          viewportHeight: 1200, // (Number) The height of the viewport.
          unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
          viewportUnit: 'vw', // (String) Expected units.
          selectorBlackList: [], // (Array) The selectors to ignore and leave as px.
          minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
          mediaQuery: false, // (Boolean) Allow px to be converted in media queries. }
        },
      },
    },

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    },
    optimization: {},

    // optimizeCSS: {}//压缩css

    /**
     * 打包独立css文件
     */
    extractCSS: true,
  }
};
