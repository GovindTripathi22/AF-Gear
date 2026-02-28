import { defineConfig } from "eslint";
import eslintConfigNext from "eslint-config-next";

// Add specific rules handling since 
// ClerkProvider can cause JSX issues during fast refresh parsing when typed poorly in some ESLint plugins
export default [
  ...eslintConfigNext,
  {
    ignores: [
      ".agent/**",
      "supabase/**"
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];
