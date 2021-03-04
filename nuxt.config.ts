// const webpack = require("webpack");
const { resolve } = require("path");
const pkg = require("./package");

module.exports = {
  mode: "universal",
  srcDir: "src/",
  // typescript: {
  //   typeCheck: {
  //     eslint: true
  //   }
  // },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  // axios: {
  //   baseURL: `${blogConfig.enableHTTPS ? 'https' : 'http'}://127.0.0.1:${blogConfig.port}`,
  //   browserBaseURL: '/'
  // },
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },

  /*
   ** Global CSS
   */
  css: [
    "element-ui/lib/theme-chalk/index.css",
    // 'element-pro-crud/lib/ProCrud.css'
  ],

  /** middleware */
  router: {
    middleware: ["router-guards"],
  },

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: "~/plugins/element-ui.ts",
    },
    {
      src: "~/plugins/axios.ts",
      mode: "server",
    },
    {
      src: "~/plugins/global.ts",
    },
    // {
    //   src: '~/plugins/element-pro-crud.ts'
    // },
    "@/plugins/svg-icon.ts",
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/router", "@nuxtjs/axios"],
  buildModules: ["@nuxt/typescript-build"],

  /*
   ** Build configuration
   */

  build: {
    extractCSS: true,
    vendor: ["element-ui"],
    babel: {
      plugins: [
        [
          "component",
          {
            libraryName: "element-ui",
            styleLibraryName: "theme-chalk",
          },
        ],
      ],
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // 排除 nuxt 原配置的影响,Nuxt 默认有vue-loader,会处理svg,img等
      // 找到匹配.svg的规则,然后将存放svg文件的目录排除
      const svgRule = config.module.rules.find((rule) =>
        rule.test.test(".svg")
      );
      svgRule.exclude = [resolve(__dirname, "src/assets/icons/svg")];
      // 添加loader规则
      config.module.rules.push({
        test: /\.svg$/, // 匹配.svg
        include: [resolve(__dirname, "src/assets/icons/svg")], // 将存放svg的目录加入到loader处理目录
        use: [
          { loader: "svg-sprite-loader", options: { symbolId: "icon-[name]" } },
        ],
      });
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push(
          {
            enforce: "pre",
            test: /\.(js|vue)$/,
            loader: "eslint-loader",
            exclude: /(node_modules)/,
            options: {
              fix: true,
            },
          },
          {
            test: /\.ts$/,
            exclude: [/node_modules/, /vendor/, /\.nuxt/],
            loader: "ts-loader",
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true,
            },
          }
        );
      }
    },
  },
};