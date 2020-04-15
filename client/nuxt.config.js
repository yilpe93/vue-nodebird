module.exports = {
  head: {
    title: "NodeBird",
  },
  modules: [
    [
      "@nuxtjs/axios",
      {
        /** anotherOption: Boolean */
      },
    ],
  ],
  // build: {
  //   /*
  //    ** You can extend webpack config here
  //    */
  //   extend(config, ctx) {
  //     // Run ESLint on save
  //     if (ctx.isDev && ctx.isClient) {
  //       config.module.rules.push({
  //         enforce: "pre",
  //         test: /\.(js|vue)$/,
  //         loader: "eslint-loader",
  //         exclude: /(node_modules)/,
  //       });
  //     }
  //   },
  // },
  buildModules: [
    "@nuxtjs/vuetify",
    [
      "@nuxtjs/vuetify",
      {
        /* module options */
      },
    ],
  ],
  /* 
    * Axios  Options 
    axios: {
      option1,
      option2
    }
  */
}
