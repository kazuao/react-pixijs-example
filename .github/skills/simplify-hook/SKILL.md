---
name: simplify-hook
description: hookのリファクタリング指針。複雑なhookを整理する場合、または複雑性の高いhookを新規実装する場合に使用する
---

複雑な hook をリファクタリングするときは、以下に従う

## 共通パターン

### 1. ロジックをモジュールレベルの純粋 async 関数として抽出する

hook 内の async ロジックは、副作用を持たない純粋関数としてモジュールレベルに切り出す

```ts
// Before: hook 内クロージャに直接記述
const handleStart = useCallback((): void => {
  void withLoadingGuard(async () => {
    const urqlClient = await connect()
    const result = await checkAvailability(urqlClient)
    if (!result.ok) { ... }
    ...
  })
}, [...])

// After: モジュールレベルの純粋関数に抽出
const executeFlow = async (
  urqlClient: Client,
  ...args,
): Promise<FlowOutcome> => {
  const result = await checkAvailability(urqlClient)
  if (!result.ok) return { type: 'api-error', failure: result }
  ...
}

const handleStart = useCallback((): void => {
  void withLoadingGuard(async () => {
    const outcome = await executeFlow(urqlClient, ...)
    switch (outcome.type) { ... }
  })
}, [...])
```

### 2. Discriminated Union でフロー結果を型化する

非同期処理の結果を `type` プロパティを持つ discriminated union で表現し、呼び出し側で `switch` 分岐する

```ts
type FlowOutcome =
  | { readonly type: "success" }
  | { readonly type: "navigate" }
  | { readonly type: "api-error"; readonly failure: Failure<ApiError> }
  | { readonly type: "aborted" };
```

- 副作用（navigate / setModal / resetSession）は純粋関数の外に追い出し、呼び出し側の switch で実行する
- `Result<T, E>` では表現しきれない複数の成功パターンも型で区別できる

### 3. 空の catch を `.catch()` に置き換える

```ts
// Before: 空の catch（例外を握りつぶす）
try {
  const client = await connect()
  ...
} catch {
  // connect() の失敗時は別途処理済み
}

// After: .catch() で明示的に処理
const client = await connect().catch((e: unknown) => {
  logger.warn('[useXxx] 接続失敗:', e)
  return null
})
if (client === null) return
```

### 4. `mounted = { current: true }` を AbortController に統一する

useEffect のクリーンアップでアンマウント後の副作用を抑止するパターンを統一する

```ts
// Before: ローカルオブジェクトでフラグ管理
const mounted = { current: true }
const run = async () => {
  ...
  if (!mounted.current) return
  ...
}
return () => { mounted.current = false }

// After: AbortController に統一
const abortController = new AbortController()
const run = async () => {
  ...
  if (abortController.signal.aborted) return
  ...
}
return () => { abortController.abort() }
```

### 5. `store.get()` を `useAtomValue` に置き換える

async 関数内での `store.get()` 直接操作は、atom を `useAtomValue` で読み取り引数として渡す形に変換する

```ts
// Before: async 関数内で store を直接操作
const store = useStore()
const run = async () => {
  if (store.get(lastRouteAtom) === ROUTES.STATUS) { ... }
}

// After: useAtomValue で読み取り、dependency に追加
const lastRoute = useAtomValue(lastRouteAtom)
const outcome = await runValidation(client, sessionId, lastRoute, signal)
```

### 6. ローディングガードを `withLoadingGuard` / `startXxx` / `stopXxx` で統一する

`isLoadingRef` + `isLoading` の二重管理パターンの初期化/クリアを専用関数に集約する。
状態更新が2箇所以上に分散している場合に適用する

```ts
// パターン A: withLoadingGuard — try/finally で ref/state を一元管理
const withLoadingGuard = useCallback(
  async (action: () => Promise<void>): Promise<void> => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true
    setIsLoading(true)
    try {
      await action()
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  },
  [],
)

const handleConfirm = useCallback((): void => {
  void withLoadingGuard(async () => { ... })
}, [withLoadingGuard, ...])

// パターン B: startXxx / stopXxx — 非同期完了タイミングが不規則な場合
const startCancelling = useCallback((): void => {
  isCancellingRef.current = true
  setIsLoading(true)
}, [])

const stopCancelling = useCallback((): void => {
  isCancellingRef.current = false
  setIsLoading(false)
}, [])
```

- `withLoadingGuard` は try/finally で確実にリセットされるため、単一の async フローに適する
- `start` / `stop` を対にして命名する
- ref と state の更新順は `start` / `stop` で統一する（ref → state）

---

### 7. `timerRef` のクリア処理を `clearTimer` ヘルパーに集約する

`if (ref.current !== null) { clearTimeout(...); ref.current = null }` が2箇所以上に分散している場合はヘルパーに抽出する

```ts
// Before: 同じパターンが handleXxx と cleanup の両方に存在
if (timerRef.current !== null) {
  clearTimeout(timerRef.current);
  timerRef.current = null;
}

// After: ヘルパー関数に集約
type TimerRef = ReturnType<typeof setTimeout> | null;

const clearTimer = (ref: { current: TimerRef }): void => {
  if (ref.current !== null) {
    clearTimeout(ref.current);
    ref.current = null;
  }
};
```

- `useRef` の型引数には `TimerRef` エイリアスを使う（`useRef<TimerRef>(null)`）
- 引数型は非推奨の `React.MutableRefObject` ではなく `{ current: TimerRef }` を使う

---

### 8. `useEffect` のガード条件を `setXxx` 関数型更新に内包する

`useEffect` 冒頭の早期 return ガードと、`setXxx` 関数型更新内の同一ガードが重複している場合は、関数型更新内だけに残す

```ts
// Before: ガード条件が2箇所に存在し、deps に state が含まれる
useEffect(() => {
  if (messages.length > 0) return; // ❶ effect 冒頭ガード
  const timer = setTimeout(() => {
    setMessages((prev) => {
      if (prev.length > 0) return prev; // ❷ updater 内ガード（重複）
      return createInitialMessages();
    });
  }, 500);
  return () => clearTimeout(timer);
}, [messages.length, setMessages]); // messages.length が deps に含まれる

// After: 関数型更新内のガードのみに一本化
useEffect(() => {
  const timer = setTimeout(() => {
    setMessages((prev) => {
      if (prev.length > 0) return prev; // ガードは updater に集約
      return createInitialMessages();
    });
  }, 500);
  return () => clearTimeout(timer);
}, [setMessages]); // deps から state を除外
```

- `setXxx(prev => ...)` の関数型更新は呼び出し時点の最新 state を受け取るため、effect 再実行なしでも正確にガードできる
- deps から state を除外することで、state 更新のたびに effect が再実行されるループを防ぐ

## チェックリスト

リファクタリング時に以下を確認する

- [ ] 空の `catch {}` がないか（`logger.warn` + `return null` に置き換える）
- [ ] async ロジックがモジュールレベルの純粋関数として切り出せるか
- [ ] フロー結果が discriminated union で型化されているか
- [ ] `mounted = { current: true }` パターンを使っていないか（AbortController に統一）
- [ ] `store.get()` を async 関数内で直接呼んでいないか（引数で渡す）
- [ ] `navigateToXxx()` などの副作用関数が複数箇所から呼ばれていないか（switch に集約）
- [ ] `timerRef` のクリアが複数箇所に重複していないか（`clearTimer` ヘルパーに集約）
- [ ] `setXxx(prev => ...)` 関数型更新でガードできる場合、useEffect 冒頭の early return と deps への state 追加を省略できないか
- [ ] `result.finally(...)` など floating Promise に `void` が付いているか
