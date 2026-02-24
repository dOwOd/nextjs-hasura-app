# Session Context

## User Prompts

### Prompt 1

Implement the following plan:

# Fix #598: NEXT_PUBLIC_HASURA_KEY / URL をサーバー専用環境変数に変更

## Context

`NEXT_PUBLIC_` プレフィックスの環境変数は Next.js のビルドでクライアントバンドルに埋め込まれる。
このプロジェクトでは Hasura の Admin Secret と URL はビルド時の Server Component でのみ使用されており、
クライアント側への露出は不要。`NEXT_PUBLIC_` を外してサーバー専用環境変数にする。

## 変更対象ファイル

### 1. `src/lib/apolloClient.ts`（メイン変更）
- `process.env.NEXT_PUBLIC_HASURA_URL` → `process.env.HASURA_URL`
- `process.env.NEXT_PUBLIC_HASURA_KEY` → `process.env.HASURA_KEY`

### 2. `.env.development`...

### Prompt 2

npm run lint の失敗は今修正できない？

### Prompt 3

含めなくてよいです。調査結果を新規作成したIssueに記載して

### Prompt 4

コミットにすすめて

