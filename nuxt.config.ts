// const webpack = require("webpack");
const { resolve } = require("path");
const pkg = require("./package");

module.exports = {
  srcDir: "src/",
  server: {
    port: 9990, // default: 3000
    host: "0.0.0.0",
  },
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
    "element-pro-crud/lib/ProCrud.css",
    "element-ui/lib/theme-chalk/index.css",
    "@/assets/styles/element-variables.scss",
    "@/assets/styles/index.scss",
  ],

  /** middleware */
  router: {
    middleware: ["auth"],
  },

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: "~/plugins/element-pro-crud.ts",
      mode: "client",
    },
    {
      src: "~/plugins/element-ui.ts",
    },
    {
      src: "~/plugins/axios.ts",
    },
    {
      src: "~/plugins/global.ts",
    },

    "@/plugins/svg-icon.ts",
    "@/plugins/components.ts",
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/router", "@nuxtjs/axios", "@nuxtjs/auth"],
  buildModules: ["@nuxt/typescript-build"],
  /*
   * Auth configuration
   * https://auth.nuxtjs.org/
   */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/users/login",
            method: "post",
            propertyName: "data.token",
          },
          user: {
            url: "/users/userinfo",
            method: "post",
            propertyName: "data",
          },
          logout: false,
        },
      },
    },
    redirect: {
      login: "/login",
      logout: "/login",
      home: "/",
    },
    cookie: {
      options: {
        maxAge: 60 * 60 * 24 * 7,
      },
    },
    localStorage: false,
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  build: {
    extractCSS: true,
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
            exclude: [/node_modules/, /\.nuxt/],
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
