# Session Context

## User Prompts

### Prompt 1

Implement the following plan:

# Plan: robots.txt と sitemap.xml の追加 (#579)

## Context

dowo.dev に `robots.txt` と `sitemap.xml` が存在しない。クローラーへの指示とサイトマップの提供ができておらず、新規記事のインデックス登録が遅れている。

## 実装内容

### 1. `public/robots.txt` を新規作成

完全に静的な内容のため `public/` に直接配置する。

```
User-agent: *
Allow: /
Sitemap: https://dowo.dev/sitemap.xml
...

### Prompt 2

PRを作成して

### Prompt 3

Base directory for this skill: /Users/sksn/Development/nextjs-hasura-app/.claude/skills/pr

## Create PR Workflow

1. Verify current branch is NOT main: `git branch --show-current`
2. If on main, create and checkout a new branch: `git checkout -b feature/issue-{number}-{description}`
3. Stage and commit all changes with a descriptive message
4. Push the branch: `git push -u origin HEAD`
5. Create PR with `gh pr create --fill --base main`
6. Body に `Closes #{番号}` を含める（Issue自動�...

