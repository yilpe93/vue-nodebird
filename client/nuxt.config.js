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
  /* 
    * Axios  Options 
    axios: {
      option1,
      option2
    }
  */
};
