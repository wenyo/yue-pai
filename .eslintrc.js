// .eslintrc.js

module.exports = {
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  rules: {
    "max-len": [
      1,
      {
        code: 120,
        tabWidth: 2,
      },
    ],
    semi: [1, "always"],
  },
};
