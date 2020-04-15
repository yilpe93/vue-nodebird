/* 
  Prettier 설정
  
  ```bash
  npm install --save-dev babel-eslint eslint eslint-config-prettier eslint-loader eslint-plugin-vue eslint-plugin-prettier prettier
  ```
*/

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2019,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:prettier/recommended",
  ],
  // required to lint *.vue files
  plugins: ["vue"],
  // add your custom rules here
  rules: {
    "prettier/prettier": [
      "error",
      {
        // "vue/max-attributes-per-line": "off",
        // "vue/singleline-html-element-content-newline": "off"
        singleQuote: true,
        semi: true,
        useTabs: true,
        tabWidth: 2,
        trailgnComma: "all",
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: "avoid",
      },
    ],
  },
};
