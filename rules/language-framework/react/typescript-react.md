# TypeScript/React 開発ルール

TypeScript および React を使用する際の命名規則、設計ルール、テストガイドライン。

---

## 前提条件

このルールは以下の環境を前提とする：

- **React 18+** (関数コンポーネント専用)
- **TypeScript 5+**
- **Vite** (ビルドツール)
- **Vitest + React Testing Library** (単体テスト)
- **Playwright** (E2E テスト)

---

## 命名規則

- コンポーネント名、ファイル名は PascalCase
- 関数や変数は camelCase
- Props の型定義は interface を使用

---

## TypeScript ルール

- 型は `any` を禁止し、`unknown` を使用して型ガードする
- 型定義は types/ に集約

---

## React ルール

- React (クラスは使用せず、関数コンポーネントのみ)
- 関数コンポーネントはアロー関数で統一する
- `defaultProps`は使用せず、引数のデフォルト値を使う
- コロケーションを意識して、共通利用するもの以外は凝集するようにする
- UI 層は、Hook, Lifecycle, Handler, UI を JSDoc の形式のコメントで集合、分離する
- 再レンダリングやパフォーマンスに配慮する（memo, useMemo 等）
- `useEffect`については、`./useEffect.md`のルールに従う

---

## Hooks

- `useMemo` / `useCallback` を適切に使用し、パフォーマンスを考慮
- hooks に例外を返却する際は、Result 型を使用する

---

## テストガイドラインへの導線

- テストの詳細な指針は同ディレクトリの `tests.md` を参照する
