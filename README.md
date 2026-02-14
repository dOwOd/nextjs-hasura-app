# nextjs-hasura-app

Next.js + Hasura GraphQL の静的ブログサイト（SSG）

https://dowo.dev

## テックスタック

| カテゴリ | 技術 |
| --- | --- |
| フレームワーク | Next.js 16（App Router, `output: 'export'`） |
| UI | React 19 + Pico CSS v2 |
| データ | Apollo Client 4 + Hasura GraphQL |
| コンテンツ | remark + rehype（Markdown → React） |
| デプロイ | Cloudflare Pages |
| 型生成 | GraphQL Code Generator |
| CI/CD | GitHub Actions + Cloudflare Pages Git 連携 |

## アーキテクチャ

完全静的サイト（SSG）。ビルド時に Hasura GraphQL API から記事データを取得し、静的 HTML を生成して Cloudflare Pages にデプロイする。サーバーランタイムは不要。

```
Hasura GraphQL API（ビルド時にデータ取得）
  ↓ Apollo Client
Next.js SSG（generateStaticParams）
  ↓ Markdown 記事の場合
remark + rehype パイプライン
  ↓
静的 HTML 生成（out/）→ Cloudflare Pages
```

## セットアップ

### 必要なもの

- Node.js 24
- npm

### 環境変数

`.env.local` を作成:

```bash
NEXT_PUBLIC_HASURA_URL=   # Hasura GraphQL エンドポイント
NEXT_PUBLIC_HASURA_KEY=   # Hasura 管理者シークレット
NEXT_PUBLIC_GA4_ID=       # GA4 Measurement ID
```

### 開発

```bash
npm install
npm run dev
```

http://localhost:3000 で確認できます。

### ビルド

```bash
npm run build
```

`out/` ディレクトリに静的ファイルが生成されます。

### その他のコマンド

```bash
npm run lint      # ESLint
npm run codegen   # GraphQL Code Generator
```

## 関連リポジトリ

- [dowo-cms](https://github.com/dOwOd/dowo-cms) - 記事管理用 CMS（Directus）
