import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import vitest from '@vitest/eslint-plugin'

// 追加プラグイン
import react from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import functional from 'eslint-plugin-functional'
import unicorn from 'eslint-plugin-unicorn'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'
import boundaries from 'eslint-plugin-boundaries'

export default defineConfig([
  globalIgnores(['build']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-you-might-not-need-an-effect': reactYouMightNotNeedAnEffect,
      react,
      import: importPlugin,
      functional,
      unicorn,
      'prefer-arrow-functions': preferArrowFunctions,
      boundaries,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'boundaries/elements': [
        { type: 'core', pattern: 'src/core/*' },
        { type: 'shared', pattern: 'src/shared/*' },
        { type: 'features', pattern: 'src/features/*' },
        { type: 'app', pattern: 'src', mode: 'file' },
      ],
      'boundaries/ignore': ['**/*.test.*', '**/*.spec.*'],
    },
    rules: {
      // ====================================
      // react-you-might-not-need-an-effect
      // ====================================
      'react-you-might-not-need-an-effect/no-derived-state': 'error',
      'react-you-might-not-need-an-effect/no-chain-state-updates': 'error',
      'react-you-might-not-need-an-effect/no-event-handler': 'error',
      'react-you-might-not-need-an-effect/no-adjust-state-on-prop-change':
        'error',
      'react-you-might-not-need-an-effect/no-reset-all-state-on-prop-change':
        'error',
      'react-you-might-not-need-an-effect/no-pass-live-state-to-parent':
        'error',
      'react-you-might-not-need-an-effect/no-pass-data-to-parent': 'error',
      'react-you-might-not-need-an-effect/no-pass-ref-to-parent': 'error',
      'react-you-might-not-need-an-effect/no-initialize-state': 'error',
      'react-you-might-not-need-an-effect/no-manage-parent': 'error',
      'react-you-might-not-need-an-effect/no-empty-effect': 'error',

      // ====================================
      // 型安全性
      // ====================================
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: true, // 文字列の暗黙チェックを許可
          allowNumber: false,
          allowNullableObject: false,
          allowNullableBoolean: false,
          allowNullableString: true, // nullable string も許可
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/restrict-plus-operands': [
        'error',
        {
          skipCompoundAssignments: false,
          allowBoolean: false,
          allowNullish: false,
          allowNumberAndString: false,
          allowRegExp: false,
          allowAny: false,
        },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowBoolean: true,
          allowNullish: false,
          allowAny: false,
          allowNever: false,
          allowRegExp: false,
        },
      ],
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/require-array-sort-compare': [
        'error',
        { ignoreStringArrays: true },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: true,
        },
      ],

      // ====================================
      // 暗黙の型変換禁止
      // ====================================
      'no-implicit-coercion': 'error',
      'prefer-template': 'error',
      'no-restricted-globals': [
        'error',
        'eval',
        'Function',
        { name: 'isFinite', message: 'Use Number.isFinite instead.' },
        { name: 'isNaN', message: 'Use Number.isNaN instead.' },
      ],

      // ====================================
      // React
      // ====================================
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.property.name='useEffect'][arguments.length!=2]",
          message: 'useEffect の第2引数（依存配列）は必須です',
        },
      ],

      // ====================================
      // import
      // ====================================
      'import/no-cycle': 'error',
      'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',

      // ====================================
      // Mutation 禁止
      // ====================================
      'functional/no-let': [
        'error',
        {
          allowInForLoopInit: true,
          allowInFunctions: false,
          ignoreIdentifierPattern: ['^mut_', '^_mut_'],
        },
      ],
      'functional/immutable-data': [
        'error',
        {
          ignoreClasses: true,
          ignoreImmediateMutation: true,
          ignoreIdentifierPattern: ['^mut_', '^_mut_'],
          ignoreAccessorPattern: [
            '**.current.**',
            '**.displayName',
            '**.onload',
            '**.onerror',
            '**.onabort',
            '**.onprogress',
            '**.ondataavailable',
            '**.onstop',
            '**.onstart',
            '**.onpause',
            '**.onresume',
            '**.onended',
          ],
        },
      ],

      // ====================================
      // ファイル名規則
      // ====================================
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],

      // ====================================
      // 命名規則
      // ====================================
      '@typescript-eslint/naming-convention': [
        'error',
        // 変数: camelCase or UPPER_CASE or PascalCase（Reactコンポーネント）
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        // 関数: camelCase or PascalCase（Reactコンポーネント）
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        // パラメータ: camelCase（未使用は _ prefix 許可）
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // boolean 変数: is/has/should/can/will prefix を強制
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'has', 'should', 'can', 'will'],
        },
        // クラス・interface・type: PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // interface に I prefix を禁止（IUser → User）
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
        // enum メンバー: PascalCase
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
      ],

      // ====================================
      // console 制限
      // ====================================
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // ====================================
      // その他
      // ====================================
      'func-style': 'error',
      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        {
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'unchanged',
          singleReturnOnly: false,
        },
      ],
      'unicorn/prefer-switch': 'error',

      // ====================================
      // boundaries（インポート方向の制御）
      // ====================================
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // app（main.tsx, App.tsx）→ すべて参照可能
            { from: 'app', allow: ['core', 'shared', 'features'] },
            // features → core, shared を参照可能
            { from: 'features', allow: ['core', 'shared', 'features'] },
            // core → shared のみ参照可能（features への依存禁止）
            { from: 'core', allow: ['core', 'shared'] },
            // shared → 他の shared のみ（core, features への依存禁止）
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],
    },
  },
  // ====================================
  // 外部同期用フックの例外
  // ====================================
  {
    files: ['src/features/chat/hooks/useMarkdownContent.ts'],
    rules: {
      'react-you-might-not-need-an-effect/no-initialize-state': 'off',
    },
  },
  // ====================================
  // テストファイル用のオーバーライド
  // ====================================
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.test.ts', '**/*.test.tsx'],
    plugins: {
      vitest,
    },
    rules: {
      // テストではモックの設定でミュータブルな操作が必要
      'functional/immutable-data': 'off',
      'functional/no-let': 'off',
      // テストでは Function 型のモックが必要な場合がある
      'no-restricted-globals': 'off',

      // ====================================
      // vitest
      // ====================================
      // テスト記述を it に統一
      'vitest/consistent-test-it': ['error', { fn: 'it' }],
      // テスト内の条件分岐を禁止
      'vitest/no-conditional-expect': 'error',
      'vitest/no-conditional-in-test': 'error',
      'vitest/no-conditional-tests': 'error',
      // mockResolvedValue / mockRejectedValue を使う
      'vitest/prefer-mock-promise-shorthand': 'error',
      // toThrow にメッセージを要求
      'vitest/require-to-throw-message': 'error',
      // トップレベル describe を要求
      'vitest/require-top-level-describe': 'error',
      // 重複テストタイトルを禁止
      'vitest/no-identical-title': 'error',
      // focused テスト（.only）を禁止
      'vitest/no-focused-tests': 'error',
      // disabled テスト（.skip）を警告
      'vitest/no-disabled-tests': 'warn',
    },
  },
])
