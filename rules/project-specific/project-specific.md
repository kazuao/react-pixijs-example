# プロジェクト特有のルール

このプロジェクト固有の技術スタック、ディレクトリ構成、および運用ルール。

---

## 使用技術

- React
- TypeScript
- Tailwind CSS（ユーティリティファースト）
- 状態管理ツールはスコープで判断する
  - 範囲が決まっている場合は`useState`
  - グローバルの場合は`Jotai`
- データ取得は SWR、reconnecting-websocket
- ルーティングは React Router

---

## ディレクトリ構成

Feature-based + Repository パターンを採用し、コロケーションを優先する。

### feature の定義

feature は「機能・ドメイン単位」で分割する。以下の 2 種類が存在する：

1. **ページ feature**: ルーティングのエントリーポイントを持つ（`{FeatureName}Page.tsx`）
2. **インフラ feature**: 複数ページから共有されるインフラ機能（WebSocket、認証など）

```
src/
├── components/          # 共通UIコンポーネント
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── ...
│
├── features/            # 機能グループ（機能・ドメイン単位）
│   ├── {featureName}/           # ページ feature
│   │   ├── {FeatureName}Page.tsx   # ルーティング用エントリーポイント
│   │   ├── {FeatureName}Page.test.tsx
│   │   ├── components/             # feature専用コンポーネント
│   │   ├── hooks/                  # feature専用hooks
│   │   ├── repositories/           # feature専用リポジトリ
│   │   ├── stores/                 # feature専用のJotai atom
│   │   ├── types.ts                # feature専用の型
│   │   └── index.ts                # 公開API
│   │
│   └── {infraFeatureName}/      # インフラ feature
│       ├── repositories/           # インフラ専用リポジトリ
│       ├── hooks/                  # インフラ専用hooks
│       ├── stores/                 # インフラ専用のJotai atom
│       ├── types.ts                # インフラ専用の型
│       └── index.ts                # 公開API
│
├── hooks/               # グローバルな共通hooks（feature に属さないもの）
├── stores/              # グローバルなJotai atom
├── types/               # 共通型定義
├── utils/               # ドメイン非依存ユーティリティ
│   └── {category}/
│
├── App.tsx              # ルーティング定義
├── main.tsx
└── index.css
```

### 配置ルール

- **コロケーション優先**: hooks / stores / types / repositories は feature 内で収まるなら feature 内に配置
- **グローバルスコープ**: 複数 feature で使い、かつ特定の機能ドメインに属さないものは `src/hooks/`, `src/stores/`, `src/types/` に配置
- **テストファイル**: 対象ファイルと同階層に `.test.ts(x)` として配置
- **ページ feature**: `{FeatureName}Page.tsx` をルーティングのエントリーポイントとして配置
- **インフラ feature**: ページを持たず、repositories / hooks / stores / types で構成

---

## プロジェクト固有の設計ルール

- スタイリングは Tailwind CSS のユーティリティクラスを使用
- ファイルインポートは、`@/` プレフィックスを使用して絶対パスで行う
- fallback の適用は、ユーザーへの許可を得る

---

## アーキテクチャ

- API 通信は feature 内の `repositories/` に集約する（コロケーション優先）
- グローバル状態管理は Jotai を使用する

### リポジトリ

- リポジトリはドメインモデルのみを扱い、永続化の詳細を隠蔽する
- テスト容易性のためにインメモリ実装を用意し、ユースケース単位で差し替え可能にする

### ユーティリティ/ヘルパー関数

- ドメイン非依存ロジックは `src/utils/{カテゴリ}/` に配置し、再利用の意図が分かる分類とファイル名にする
- 特定ドメインに紐づく純粋関数は層内の `helpers/` ディレクトリにまとめ、JSDoc で入力・出力・用途を明記する

---

## ツールとコマンド

- pnpm を使用する
- 本番でも残すログは`logger`を使用し、一時的にデバッグする場合は`console.log`を使用
- スタイルはユーザーの許可なく変更しない

---

## ドキュメント管理

- hooks
- tests（`docs/tests/tips.md`など）
