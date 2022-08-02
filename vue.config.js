module.exports = {
  // for develop on github
  // publicPath: process.env.NODE_ENV === "production" ? "/yue-pai/" : "/",

  // use file on desktop
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/assets/scss/variables.scss";`,
      },
    },
  },
};
