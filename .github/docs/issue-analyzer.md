# Issue自動分析ワークフロー

## 機能概要

「実装依頼」テンプレートでIssueを作成すると、Gemini APIが自動で要件を分析し、実装プランを提案します。

### 初回分析（Issue作成時）

1. **要件の整理** - Issueの要件を具体的に箇条書きで整理
2. **修正候補ファイルの特定** - 修正が必要と思われるファイルをリストアップ
3. **実装プランの提案** - ステップバイステップの実装計画を生成
4. **作業用ブランチの自動作成** - `feature/issue-{番号}` ブランチを自動作成

### 再分析（/reanalyze コマンド）

- Issueのコメント欄で軌道修正のコメントを投稿
- `/reanalyze` とコメントすると、過去のコメント履歴を反映して再分析
- 新しい分析結果がIssueにコメント投稿される

## セットアップ手順

### 1. Gemini APIキーの取得

1. [Google AI Studio](https://aistudio.google.com/) にアクセス
2. Googleアカウントでサインイン
3. 左側のメニューから「Get API Key」をクリック
4. 「Create API key」をクリック
   - 既存のGoogle Cloudプロジェクトがある場合は選択
   - ない場合は「Create API key in new project」を選択
5. 生成されたAPIキーをコピー

### 2. GitHub Secretsに登録

1. GitHubリポジトリの **Settings** タブをクリック
2. 左側のメニューから **Secrets and variables** > **Actions** を選択
3. **New repository secret** をクリック
4. 以下を入力：
   - **Name**: `GEMINI_API_KEY`
   - **Secret**: コピーしたAPIキー
5. **Add secret** をクリック

## 使用方法

### 初回分析

1. GitHubリポジトリで新しいIssueを作成
2. テンプレートから「実装依頼」を選択
3. 以下のセクションを記入：
   - **概要**: 何を実現したいかを1-2文で簡潔に
   - **背景・目的**: なぜこの機能/修正が必要なのか
   - **実現したいこと**: 具体的な要件を箇条書きで
4. Issueを作成すると、数分後に自動で分析結果がコメントされる

### 再分析

1. 分析結果を見て、軌道修正が必要な場合はコメントで追加情報を投稿
2. `/reanalyze` とコメント
3. 過去のコメント内容を反映した新しい分析結果が投稿される

## 技術仕様

### 使用モデル

- **gemini-2.5-flash** (2025年6月リリースの安定版)
- 入力トークン: 1,048,576
- 出力トークン: 65,536

### 無料枠の制限

| 項目 | 制限 |
|------|------|
| リクエスト/分 | 15 RPM |
| リクエスト/日 | 1,500 RPD |
| トークン/分 | 100万 TPM |

通常の使用では無料枠で十分です。

## ワークフローの仕組み

### トリガー条件

#### 初回分析
- イベント: `issues.opened`
- 条件: Issue本文に「## 概要」と「## 実現したいこと」の両方が含まれる

#### 再分析
- イベント: `issue_comment.created`
- 条件: コメントが `/reanalyze` で始まる

### 処理フロー

```
Issue作成
    ↓
プロジェクト構造情報を収集
    ↓
Gemini APIで分析
    ↓
分析結果をIssueにコメント
    ↓
作業用ブランチを作成 (feature/issue-{番号})
    ↓
ブランチ情報をコメント
```

## トラブルシューティング

### エラー: 「自動分析でエラーが発生しました」

#### 原因1: APIキーが未設定または無効

**解決方法:**
1. GitHub Secretsに `GEMINI_API_KEY` が正しく登録されているか確認
2. APIキーが有効か確認（[Google AI Studio](https://aistudio.google.com/) で確認）
3. 新しいAPIキーを発行して再設定

#### 原因2: クォータ制限

**解決方法:**
- 15RPM、1,500RPDの制限に達している可能性
- 数分待ってから `/reanalyze` で再試行
- [Usage Monitor](https://ai.dev/rate-limit) で使用状況を確認

#### 原因3: モデルが見つからない

**解決方法:**
- ListModels APIで利用可能なモデルを確認
- スクリプトのモデル名を確認

### ワークフローが起動しない

#### 原因: テンプレートの条件を満たしていない

**解決方法:**
- Issue本文に「## 概要」と「## 実現したいこと」の両方が含まれているか確認
- 「実装依頼」テンプレートを使用して作成する

## ファイル構成

```
.github/
├── workflows/
│   └── issue-analyzer.yml      # ワークフロー定義
├── scripts/
│   └── analyze-issue.js         # Gemini API呼び出しスクリプト
└── docs/
    └── issue-analyzer.md        # このドキュメント
```

## 関連リンク

- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
