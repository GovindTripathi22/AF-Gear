import eslintConfigNext from "eslint-config-next";

const config = [
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

export default config;
