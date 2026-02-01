const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

module.exports = [
    { ignores: ['dist/**'] },
    ...compat.extends(
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
        'plugin:prettier/recommended',
    ),
    {
        plugins: {
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
            vue: require('eslint-plugin-vue'),
            prettier: require('eslint-plugin-prettier'),
        },
        languageOptions: {
            parser: require('vue-eslint-parser'),
            parserOptions: {
                parser: require('@typescript-eslint/parser'),
            },
            globals: {
                defineProps: 'readonly',
                defineEmits: 'readonly',
                defineExpose: 'readonly',
                withDefaults: 'readonly',
            },
        },
        rules: {
            'prettier/prettier': [
                'off',
                {
                    endOfLine: 'auto',
                },
            ],
            indent: ['error', 4, { SwitchCase: 1 }],
            semi: [2, 'always'],
            'vue/multi-word-component-names': 'off',
        },
    },
    {
        files: ['eslint.config.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: {
                module: 'readonly',
                require: 'readonly',
                __dirname: 'readonly',
            },
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
            'no-undef': 'off',
        },
    },
];
