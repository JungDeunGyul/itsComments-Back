module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  ignorePatterns: ["setup.js", "*.spec.js"],
  extends: ["eslint:recommended", "plugin:node/recommended", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}", "./bin/www"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["prettier"],
  rules: {
    semi: "warn",
    "no-underscore-dangle": 0,
    "func-names": "off",
    "no-unused-vars": "warn",
    "no-param-reassign": 0,
    "consistent-return": "off",
  },
};
