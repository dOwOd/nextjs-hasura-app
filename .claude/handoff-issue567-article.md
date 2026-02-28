# 引き継ぎ: Issue #567 ISR→SSG移行ブログ記事

## ステータス: 完了（記事公開済み）

## ブランチ

`docs/issue-567-architecture-diagrams`（PR #568）

## コミット履歴

1. `ba4d177` - アーキテクチャ図（Before/After SVG）
2. `5c410c9` - Agent Team 作成（style-analyzer, article-writer, article-editor）
3. `5797eff` - 記事ドラフト初版
4. `5fbfba8` - 推敲第1回（文体調整・構成改善）
5. `a675196` - `transpilePackages` 削除（不要と判明）
6. `3430eb3` - 推敲第2回（事実確認・リファレンス追加）
7. `657bf26` - 推敲第3回（重複セクション削除・簡潔化）
8. `45312b9` - 推敲第4回（ドメイン管理・DNS表現・Directus説明・構成統合）
9. `53572f1` - 文末表現を「だ・である」調に統一

## 記事の公開先

Directus CMS に入稿済み。Deploy Hooks 経由で Cloudflare Pages にデプロイ。

## 文体方針

- **文末**: だ・である調で統一（公開記事の「です・ます」調とは意図的に異なる）
- **一人称**: 「自分」基本、省略多め
- **口語度**: 7:3（口語:フォーマル）
- **締め**: 「では。」

## 関連ファイル

| ファイル | 説明 |
|---|---|
| `draft-article.md` | 記事本文（ドラフト） |
| `public/images/isr-to-ssg/architecture-before.svg` | Before アーキテクチャ図 |
| `public/images/isr-to-ssg/architecture-after.svg` | After アーキテクチャ図 |
| `scripts/generate-diagrams.mjs` | SVG 図生成スクリプト |
