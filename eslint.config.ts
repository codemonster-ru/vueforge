import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    { ignores: ['dist/**', 'apps/dist/**', '**/dist/**'] },
    ...compat.extends(
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
        'prettier',
    ),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
            vue,
        },
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsParser,
            },
            globals: {
                defineProps: 'readonly',
                defineEmits: 'readonly',
                defineExpose: 'readonly',
                withDefaults: 'readonly',
            },
        },
        rules: {
            'vue/multi-word-component-names': 'off',
        },
    },
];
