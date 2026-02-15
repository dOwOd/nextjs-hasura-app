# Session Context

## User Prompts

### Prompt 1

teamを起動して #561 の内容を確認して

### Prompt 2

実装に進んで

### Prompt 3

Base directory for this skill: /Users/sksn/Development/nextjs-hasura-app/.claude/skills/pr

## Create PR Workflow

1. Verify current branch is NOT main: `git branch --show-current`
2. If on main, create and checkout a new branch: `git checkout -b feature/issue-{number}-{description}`
3. Stage and commit all changes with a descriptive message
4. Push the branch: `git push -u origin HEAD`
5. Create PR with `gh pr create --fill --base main`
6. Body に `Closes #{番号}` を含める（Issue自動�...

