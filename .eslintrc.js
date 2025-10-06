module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    next: {
      rootDir: ["./"],
    },
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals", // rules mặc định của Next.js
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn", // cảnh báo khi dùng any
    // "@typescript-eslint/no-explicit-any": "error", // muốn lỗi hẳn thì dùng dòng này
  },
};
