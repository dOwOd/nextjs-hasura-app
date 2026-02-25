# Session Context

## User Prompts

### Prompt 1

Implement the following plan:

# パフォーマンス計測スクリプトの作成

## Context

Next.js → Vinext 移行（Issue #614）にあたり、移行前後のパフォーマンスを定量的に比較したい。現在パフォーマンス計測の仕組みはないため、再現性のある計測スクリプトを新規作成する。

## 計測対象

### 1. ビルドパフォーマンス（ローカル計測）

| 指標 | 計測方法 |
|------|----------|
| ビルド時間 | `next build` / `vinext build` の実行時間を `performance.now()` で計測 |
| 出力サイズ | `out/` ディレクトリの合計サイズ（`du -sb`） |
| dev サーバー起動時間 | dev サーバーが「ready」を出力するまでの時間 |

### 2. ページパフォーマンス（デプロイ後計測）

| 指標 | 計測方法 |
|------|----------|
| TTFB | `curl -w` で `time_starttran...

### Prompt 2

他に計測したほうが良い項目はない？

### Prompt 3

追加して

### Prompt 4

PRをつくって

### Prompt 5

Base directory for this skill: /Users/sksn/Development/nextjs-hasura-app/.claude/skills/pr

## Create PR Workflow

1. Verify current branch is NOT main: `git branch --show-current`
2. If on main, create and checkout a new branch: `git checkout -b feature/issue-{number}-{description}`
3. Stage and commit all changes with a descriptive message
4. Push the branch: `git push -u origin HEAD`
5. Create PR with `gh pr create --fill --base main`
6. Body に `Closes #{番号}` を含める（Issue自動クローズ）
7. 必要に応じて CL...

