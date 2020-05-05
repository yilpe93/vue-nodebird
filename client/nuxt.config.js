module.exports = {
  css: ["assets/main.css"],
  head: {
    title: "NodeBird",
    meta: [
      {
        charset: "utf=8",
      },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, user-scalable=yes, viewport-if--fit=cover",
      },
      // 검색엔진, robot.txt
      {
        name: "description",
        content: "NodeBird SNS",
      },
      // 공유
      {
        hid: "ogtitle", //
        name: "og:title",
        content: "NodeBird",
      },
      {
        hid: "ogdesc",
        name: "og:description",
        content: "NodeBird SNS",
      },
      {
        hid: "ogtype",
        property: "og:type",
        content: "website",
      },
      {
        hid: "ogimg",
        property: "og:image",
        content: "https://vue.nodebird.com/vue-nodebird.png",
      },
      {
        hid: "ogurl",
        property: "og:url",
        content: "https://vue.nodebird.com",
      },
    ],
    link: [
      // Favicon
      {
        rel: "shortcut-icon",
        href: "/vue-nodebird.png",
      },
    ],
  },
  buildModules: [],
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/vuetify",
    "@nuxtjs/moment",
    // [
    //   "@nuxtjs/axios",
    //   {
    //     /** anotherOption: Boolean */
    //   },
    // ],
  ],
  moment: {
    locales: ["ko"],
  },
  build: {
    analyze: false, // 배포할 때는 false
    extend(config, { isClient, isServer, isDev }) {
      if (!isServer && !isDev) {
        config.devtool = "hidden-source-map";
      }
      console.log("webpack", config, isServer, isClient), isDev;
    },
  },
  vuetify: {},
  axios: {
    browserBaeURL: "http://localhost:3085", // client axios
    baseURL: "http://localhost:3085", // server axios
    https: false,
  },
  // nuxt.config.js 에서 port 설정
  server: {
    port: process.env.PORT || 3080,
  },
};

/* 
  # nuxt에서 제공하는 analyze => gzip 성능보다
    compression-webpack-plugin => gzip 성을이 뛰어나다.
*/
