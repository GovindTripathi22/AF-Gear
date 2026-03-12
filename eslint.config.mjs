import eslintConfigNext from "eslint-config-next";

export default [
    ...eslintConfigNext,
    {
        ignores: [
            ".agent/**",
            "supabase/**",
            ".next/**"
        ],
        rules: {
            "@typescript-eslint/no-explicit-any": "off"
        }
    }
];
