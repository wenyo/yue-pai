module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/yue-pai/" : "/",
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/assets/scss/variables.scss";`,
      },
    },
  },
};
