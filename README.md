# React + TypeScript + Vite 8 + Tailwind CSS v4 Boilerplate

React 19 / TypeScript / Vite 8 を前提としたフロントエンド用テンプレートである
Node は fnm で 24 系に固定し、整形は Oxfmt、Lint は ESLint を利用する

---

## 特徴

- Core: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- Build Tool: [Vite 8](https://vite.dev/)
- Styling: [Tailwind CSS v4](https://tailwindcss.com/)
- Package Manager: [pnpm](https://pnpm.io/)
- Lint: [ESLint](https://eslint.org/) (Flat Config)
- Format: [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)
- Configuration: Path Alias 設定済み (`@/` = `src/`)

---

## 必須要件

- [fnm](https://github.com/Schniz/fnm)
- Node.js 24 系
- pnpm 10 系

このリポジトリでは [.node-version](.node-version) と `package.json` の `engines` で実行環境を明示している

パッケージマネージャーは pnpm のみを許可している
`preinstall` で `only-allow pnpm` を実行しているため、`npm install` や `npx npm install` のようなフローは失敗する

---

## セットアップ

```bash
# 作成したリポジトリをクローン
git clone https://github.com/your-username/your-new-project.git
cd your-new-project

# .node-version に合わせて Node.js を入れる
fnm install
fnm use

# 依存関係のインストール
pnpm install
```

必要に応じて `package.json` の `name` をプロジェクト名に変更する

`pnpm-workspace.yaml` では `packageManagerStrictVersion: true` を有効にしている
`.node-version` に合わせて Node を切り替えたうえで、`package.json` の `packageManager` に記載された pnpm を使う

---

## 開発

```bash
pnpm dev
```

ブラウザで `http://localhost:5173` を開いて確認する

---

## 利用可能なスクリプト

| コマンド | 説明 |
| :--- | :--- |
| `pnpm dev` | 開発サーバーを起動する |
| `pnpm build` | TypeScript のビルドと Vite の本番ビルドを実行する |
| `pnpm preview` | ビルド結果をローカルで確認する |
| `pnpm lint` | ESLint を実行する |
| `pnpm format` | Oxfmt でコードを整形する |
| `pnpm format:check` | Oxfmt で未整形のファイルがないか確認する |

コミット時には、変更された `ts` / `tsx` ファイルに対して `eslint --fix` と `oxfmt --write` が自動実行される

---

## 依存関係の追加と更新

新しいパッケージを追加するときは `npm install` ではなく、必ず pnpm のサブコマンドを使う

```bash
# 本番依存を追加
pnpm add <package-name>

# 開発依存を追加
pnpm add -D <package-name>

# 依存を削除
pnpm remove <package-name>
```

`.npmrc` では `frozen-lockfile=true` を有効にしているため、通常のセットアップでは lockfile の差分を勝手に更新しない
依存関係の追加や更新は `pnpm add` / `pnpm remove` を使って `package.json` と `pnpm-lock.yaml` を同時に更新する
`package.json` を手で編集したあとに lockfile を意図的に再生成する場合だけ、`pnpm install --no-frozen-lockfile` を使う

---

## ディレクトリ構成

```text
.
├── .node-version        # fnm 用の Node.js バージョン固定
├── .oxfmtrc.json        # Oxfmt 設定
├── public/              # 静的アセット
├── src/
│   ├── assets/          # 画像などのアセット
│   ├── lib/             # ユーティリティ
│   ├── App.tsx          # メインコンポーネント
│   ├── index.css        # Tailwind v4 のエントリー CSS
│   └── main.tsx         # エントリーポイント
├── eslint.config.js     # ESLint 設定
├── index.html           # HTML エントリーポイント
├── package.json         # 依存関係とスクリプト
├── pnpm-lock.yaml       # ロックファイル
├── tsconfig.json        # TypeScript 設定
└── vite.config.ts       # Vite 設定
```

---

## Formatter 方針

- ESLint はそのまま利用する
- Prettier は使わず、Oxfmt に置き換えている
- 無視設定は `.oxfmtrc.json` の `ignorePatterns` で管理している
- Tailwind のクラス順は Oxfmt の `sortTailwindcss` でそろえる

---

## Tailwind CSS v4 の使い方

Tailwind v4 では `tailwind.config.js` は不要である
CSS 変数のカスタマイズは `src/index.css` で行う

```css
@import 'tailwindcss';

@theme {
  --font-display: 'Satoshi', 'sans-serif';
  --breakpoint-3xl: 1920px;
  --color-avocado-100: oklch(0.99 0.03 132.75);
  --color-avocado-500: oklch(0.84 0.18 117.33);
}
```

詳細は [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs) を参照する
