---
name: feature-scaffold
description: feature新規作成時のディレクトリ構成と配置ルール。新しいfeatureを作成する場合、またはディレクトリ構成を確認する場合に使用する
---

新しい feature を作成するときは、以下に従う

## ディレクトリ構成

```tree
src/features/{featureName}/
├── {FeatureName}Page.tsx         # ルーティング用エントリーポイント
├── {FeatureName}Page.test.tsx
├── components/                   # feature専用コンポーネント
├── hooks/                        # feature専用hooks
├── repositories/                 # feature専用リポジトリ
├── stores/                       # feature専用のJotai atom
├── types.ts                      # feature専用の型
└── index.ts                      # 公開API
```

## 配置ルール

- コロケーション優先: hooks / stores / types は feature 内で収まるなら feature 内に配置
- グローバルスコープ: 複数 feature で使うものは `src/shared/` 配下に配置
- テストファイル: 対象ファイルと同階層に `.test.ts(x)` として配置
- アプリケーション基盤: API クライアントや設定ファイルは `src/core/` 配下に配置
- ページコンポーネント: feature 内に `{FeatureName}Page.tsx` として配置（feature がルーティングのエントリーポイント）

## ユーティリティ/ヘルパー関数の配置

- ドメイン非依存の汎用ロジックは `src/shared/utils/{カテゴリ}/` に配置する
- 特定ドメインに紐づくロジックは、使用する feature 内に配置する（コロケーション優先）
  - 基本は feature 直下や `hooks/` 等の近くに配置し、数が増えてきた場合のみ `utils/` や `helpers/` ディレクトリを切って整理する

## 依存方向（ESLint `boundaries/element-types` で強制済）

- `app`（main.tsx, App.tsx）→ すべて参照可能
- `features` → `core`, `shared` を参照可能
- `core` → `shared` のみ参照可能（features への依存禁止）
- `shared` → 他の `shared` のみ（core, features への依存禁止）
