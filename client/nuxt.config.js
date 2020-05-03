module.exports = {
  css: ["assets/main.css"],
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
  buildModules: [
    "@nuxtjs/vuetify",
    [
      "@nuxtjs/vuetify",
      {
        /* module options */
      },
    ],
  ],
  axios: {
    browserBaeURL: "http://localhost:3085", // client axios
    baseURL: "http://localhost:3085", // server axios
    https: false,
  },
  // nuxt.config.js 에서 port 설정
  // server: {
  //   port: 3080
  // }
};
