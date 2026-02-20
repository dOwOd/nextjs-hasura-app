# Session Context

## User Prompts

### Prompt 1

Implement the following plan:

# Issue #578: SEO メタデータの追加

## Context

すべてのページで `description`、OGP、Twitter Card、canonical URL が未設定。検索結果のスニペットや SNS シェア時のプレビューカードが表示されず、SEO に影響がある。Cloudflare Pages のプレビュー URL との重複コンテンツ問題もあるため、canonical URL も設定する。

## 変更ファイル一覧

| ファイル | 種別 | 内容 |
|---|---|-...

### Prompt 2

PR作って

### Prompt 3

Base directory for this skill: /Users/sksn/Development/nextjs-hasura-app/.claude/skills/pr

## Create PR Workflow

1. Verify current branch is NOT main: `git branch --show-current`
2. If on main, create and checkout a new branch: `git checkout -b feature/issue-{number}-{description}`
3. Stage and commit all changes with a descriptive message
4. Push the branch: `git push -u origin HEAD`
5. Create PR with `gh pr create --fill --base main`
6. Body に `Closes #{番号}` を含める（Issue自動�...

