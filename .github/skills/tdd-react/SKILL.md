---
name: tdd-react
description: TDDワークフローとVitest/RTLのテスト指針。テストを書く場合、テストの仕組みを確認する場合、またはユーザーが「テストを書いて」「TDDで」と言う場合に使用する
---

テストを書くときは、以下に従う

## テスト方針

- Vitest + React Testing Library でユニットテスト、Playwright で E2E を行う
- アプリケーションロジックに関与しない補助的な処理（例: logger）はテスト対象外としてよい
- `docs/tests/tips.md` を常に参照して、翻訳ヘルパーやモックの扱いを統一する

## TDD ワークフロー

1. `*.test.tsx` に期待挙動を記述し、失敗するテストを先に作成する（React Testing Library を利用）
2. 最小限のコンポーネント実装や Hook でテストを Green にする。UI に依存しないロジックは純粋関数として切り出す
3. 副作用や外部依存はスタブ・モックで隔離し、最終的にアダプター層へ押し出す
4. Green の状態でリファクタリングして責務を整理する
5. テスト追加時も Red → Green → Refactor を崩さない

## テスト配置と命名

- テストファイルは対象ファイルと同階層に `.test.ts(x)` として配置する
- ファイル名は `<ComponentName>.test.tsx` の形式とする
- 1 コンポーネント 1 ファイルを基本とし、関係の深いユーティリティは同テスト内で扱う

## コンポーネントテストの指針

- DOM 取得は `data-testid` を基本とし、ID は `constants/testIds.ts` で一元管理する
- `getByTestId` を優先し、テキスト検証が必要な場合は i18n キーを `getByText` で参照する
- UI 振る舞いとロジックを分離するため、イベントハンドラや副作用は Hook に集約する

## コマンド

- 型検査: `pnpm tsc -b`
- 単体テスト: `pnpm test {ファイル名}`
- 全体テスト: `pnpm test`
