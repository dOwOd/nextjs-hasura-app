# nextjs-hasura-app

Next.js + Hasura GraphQL の静的ブログサイト（SSG）

## 共有設定

`.claude/rules/` と `.claude/skills/` の一部は [claude-shared](https://github.com/dOwOd/claude-shared) からシンボリックリンクで参照している。

- **共有ファイルの変更**: `~/Development/claude-shared/` 側を編集・コミットする
- **プロジェクト固有の上書き**: シンボリックリンクを削除してローカルファイルに置き換える

## Gitワークフロー

- Issue/機能ごとに必ず `main` から新しいブランチを作成する。`main` に直接コミットしない
- ブランチ命名: `feature/issue-{番号}-{説明}` または `fix/issue-{番号}-{説明}`
- 作業開始前に `git branch --show-current` で正しいブランチにいることを確認する

## 実装アプローチ

- **実装開始前に `git branch --show-current` でブランチを確認**し、必要なら `main` から専用ブランチを作成する
- ユーザーの要求を記述通りに正確に実装する。要求を再解釈しない
- ユーザーが要求していないUI要素やリファクタリングを勝手に追加しない
- **不明点がある場合は必ずユーザーに確認を取る** — 勝手に判断・推測で実装しない

## TypeScript規約

- `as` による型アサーションよりも適切な型ガードを優先する
- 型エラー修正時、ユーザーの明示的な承認なしに型アサーションを使用しない
- **`const` で関数を定義する**（アロー関数または関数式）

## 開発コマンド

```bash
npm install && npm run dev   # 開発開始
npm run lint                 # ESLint実行
npm run codegen              # GraphQL Code Generator実行
npm run build                # 本番ビルド（favicon生成 → out/ に静的ファイル生成）
```

## テック・スタック

| カテゴリ | 技術 |
| --- | --- |
| フレームワーク | Next.js 16（App Router, `output: 'export'`） |
| UI | React 19 + Pico CSS v2 |
| データ | Apollo Client 4 + Hasura GraphQL |
| コンテンツ | remark + rehype（Markdown → React） |
| デプロイ | Cloudflare Pages（静的サイト, カスタムドメイン: dowo.dev） |
| 型生成 | GraphQL Code Generator |
| CI/CD | Cloudflare Pages Git連携（mainマージ時に自動デプロイ + PRプレビュー）+ GitHub Actions（手動リビルド `workflow_dispatch`） |
| 依存関係管理 | Renovate |

## アーキテクチャ

- **完全静的サイト (SSG)**: ビルド時に Hasura GraphQL API から記事データを取得し、静的 HTML を生成
- **記事管理**: Directus CMS（[dowo-cms](https://github.com/dOwOd/dowo-cms)）から編集。既存の Hasura PostgreSQL に直接接続
- **サーバーランタイム不要**: Cloudflare Pages に純粋な静的ファイルとしてデプロイ
- **Turbopack**: Next.js 16 のデフォルトバンドラー。Apollo Client 4 との互換性のため `transpilePackages` が必要

## ファイル構造

### ページ（src/app/）

- **layout.tsx** - ルートレイアウト（ImageModal）
- **page.tsx** - トップページ（ブログ記事一覧）
- **not-found.tsx** - 404ページ
- **blog/[slug]/page.tsx** - ブログ個別ページ（`generateStaticParams` で SSG）
- **prototypes/page.tsx** - プロトタイプページ

### コンポーネント（src/components/）

- **Layout/index.tsx** - メインレイアウト（ヘッダー・フッター）
- **Article/index.tsx** - 記事詳細表示（Markdown描画）
- **BreadCrumb/index.tsx** - パンくずナビゲーション
- **ImageModal/index.tsx** - 画像モーダル
- **CustomImage/index.tsx** - Markdown用カスタム画像
- **CustomLink/index.tsx** - Markdown用カスタムリンク
- **Profile/index.tsx** - ユーザープロフィール
- **Accounts/index.tsx** - アカウント表示
- **AccountLink/index.tsx** - アカウントリンク
- **PageTitle/index.tsx** - ページタイトル
- **GoogleAnalytics/index.tsx** - GA4統合
- **Timer/index.tsx** - タイマー
- **TopIcon/index.tsx** - トップアイコン
- **SeeYou/index.tsx** - SeeYouコンポーネント

### ロジック（src/lib/）

- **apolloClient.ts** - Apollo Client設定（ビルド時データ取得用）
- **context/ImageModalContext.tsx** - 画像モーダルコンテキスト
- **utils/DateFormat.ts** - 日付フォーマット
- **utils/markdownToReactElement.ts** - Markdown→React変換

### データ（src/）

- **gql/graphql.ts** - GraphQL Code Generator生成ファイル（**編集不可**）
- **gql/gql.ts** - 生成ファイル（**編集不可**）
- **gql/fragment-masking.ts** - 生成ファイル（**編集不可**）
- **gql/index.ts** - gql エクスポート
- **queries/queries.ts** - GraphQLクエリ定義
- **@types/cdate/index.d.ts** - cdate型定義
- **@types/gtag.d.ts** - gtag型定義

### 設定

- **next.config.js** - Next.js設定（`output: 'export'`, `transpilePackages: ['@apollo/client']`, `images.unoptimized`）
- **codegen.ts** - GraphQL Code Generator設定
- **eslint.config.mjs** - ESLint設定（Next.js + Prettier）
- **prettier.config.js** - Prettier設定（セミコロンなし、シングルクォート）
- **tsconfig.json** - TypeScript設定
- **.node-version** - Node.js バージョン管理（開発環境・GitHub Actions・Cloudflare Pages 共通。Cloudflare Pages は `.node-version` を自動検知するため、環境変数 `NODE_VERSION` の設定は不要）

### スクリプト（scripts/）

- **generate-diagrams.mjs** - アーキテクチャ図のSVG生成
- **generate-favicons.mjs** - favicon自動生成（`public/images/favicon/` 内の画像から `icon.png`, `apple-icon.png`, `favicon.ico` を生成。`npm run build` 時に自動実行）

### favicon

- **ソース画像**: `public/images/favicon/` に画像を1枚だけ配置する（ファイル名は任意、PNG/JPG/WebP対応）
- **生成ファイル**: `src/app/icon.png`, `src/app/apple-icon.png`, `public/favicon.ico`（`.gitignore` 済み）
- **差し替え方法**: `public/images/favicon/` 内の画像を入れ替えてビルドするだけで全 favicon が更新される

### CI/CD（.github/workflows/）

- **cloudflare-pages.yml** - Cloudflare Pagesデプロイ（手動 workflow_dispatch、バックアップ用）
- **issue-analyzer.yml** - Issue自動分析（Gemini API）

### Docker

- **Dockerfile** - Node.js 24 Alpine
- **docker-compose.yml** - 開発サーバー（ポート3000）

## データフロー

```
GraphQLクエリ（src/queries/queries.ts）
  ↓ Apollo Client（src/lib/apolloClient.ts）
Hasura GraphQL API（ビルド時に取得）
  ↓ レスポンス
generateStaticParams / Server Component
  ↓ Markdown記事の場合
remark + rehype パイプライン（markdownToReactElement.ts）
  ↓ React Element
静的HTML生成（out/）
```

## 記事更新フロー

```
Directus CMS で記事を編集（dowo-cms）
  ↓ PostgreSQL に直接書き込み
Hasura PostgreSQL（原本）
  ↓ Directus Flows → Cloudflare Pages Deploy Hooks
npm run build → out/ に静的ファイル生成
  ↓
Cloudflare Pages にデプロイ
```

> **手動リビルド**: GitHub Actions の `workflow_dispatch` からも実行可能

## 環境変数

```bash
# Hasura
HASURA_URL=               # Hasura GraphQLエンドポイント
HASURA_KEY=               # Hasura管理者シークレット

# Google Analytics
NEXT_PUBLIC_GA4_ID=       # GA4 Measurement ID

# Cloudflare（CI/CDのみ）
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
```

## スキル

- `/commit` - コミット規約に従ったコミット作成
- `/pr` - PR作成ワークフロー
- `/issue` - GitHub Issue作成

## チェックリスト

- [ ] ESLintエラーなし (`npm run lint`)
- [ ] GraphQL型生成の整合性 (`npm run codegen`)
- [ ] ビルド成功 (`npm run build`)
- [ ] コミット規約に従う
- [ ] PR作成（`Closes #番号`でIssue紐づけ）
