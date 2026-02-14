# Session Context

## User Prompts

### Prompt 1

Implement the following plan:

# Agent Team 作成プラン

## Context

このプロジェクト（Next.js + Hasura GraphQL 静的ブログサイト）に `.claude/agents/` を作成し、開発ワークフロー全体をカバーする7つのカスタムエージェントを配置する。既存スキル（`/commit`, `/pr`, `/issue`）と重複しない設計。

## 作成するエージェント一覧

| # | Agent | ファイル | Model | ツール | 役割 |
|---|-------|---------|-------|--...

### Prompt 2

Base directory for this skill: /Users/sksn/Development/nextjs-hasura-app/.claude/skills/pr

## Create PR Workflow

1. Verify current branch is NOT main: `git branch --show-current`
2. If on main, create and checkout a new branch: `git checkout -b feature/issue-{number}-{description}`
3. Stage and commit all changes with a descriptive message
4. Push the branch: `git push -u origin HEAD`
5. Create PR with `gh pr create --fill --base main`
6. Body に `Closes #{番号}` を含める（Issue自動�...

