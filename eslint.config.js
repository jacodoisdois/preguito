import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
    {
        ignores: ["dist/", "scripts/", "*.config.*"],
    },
    {
        files: ["src/**/*.ts", "tests/**/*.ts"],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
        },
        rules: {
            ...eslint.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,

            // TypeScript strict rules
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],

            // General quality
            "no-console": "off",
            "no-undef": "off", // TypeScript handles this
            "no-unused-vars": "off", // Use TS version instead
        },
    },
];
