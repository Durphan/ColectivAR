import globals from "globals";
import parser from "@babel/eslint-parser";

export default [
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-typescript"],
        },
      },
      globals: { ...globals.node, ...globals.es2021 },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-console": "error",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "no-trailing-spaces": "error",
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
    },
  },
];
