<<<<<<< HEAD
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
=======
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
>>>>>>> 3821d51ef6907b25405ee28a29115574ea73e822
