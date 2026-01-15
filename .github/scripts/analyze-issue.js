const fs = require('fs');
const https = require('https');

// 環境変数の取得
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
const EVENT_NAME = process.env.EVENT_NAME;

// 初回分析時の環境変数
const ISSUE_BODY = process.env.ISSUE_BODY;
const ISSUE_TITLE = process.env.ISSUE_TITLE;
const ISSUE_NUMBER = process.env.ISSUE_NUMBER;

// 再分析時の環境変数
const COMMENT_ISSUE_NUMBER = process.env.COMMENT_ISSUE_NUMBER;

// Gemini API設定
const GEMINI_MODEL = 'gemini-2.0-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * HTTPS GETリクエストを実行
 */
function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Gemini APIを呼び出す
 */
async function callGeminiAPI(prompt) {
  const requestBody = JSON.stringify({
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  });

  return new Promise((resolve, reject) => {
    const url = new URL(API_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.candidates && json.candidates[0]?.content?.parts[0]?.text) {
            resolve(json.candidates[0].content.parts[0].text);
          } else {
            reject(new Error(`Unexpected API response: ${JSON.stringify(json)}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

/**
 * GitHub APIでIssueのコメントを取得
 */
async function getIssueComments(issueNumber) {
  const url = `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${issueNumber}/comments`;
  const headers = {
    'User-Agent': 'GitHub-Actions',
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  };

  return httpsGet(url, headers);
}

/**
 * GitHub APIでIssueの情報を取得
 */
async function getIssue(issueNumber) {
  const url = `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${issueNumber}`;
  const headers = {
    'User-Agent': 'GitHub-Actions',
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  };

  return httpsGet(url, headers);
}

/**
 * 初回分析
 */
async function analyzeNewIssue() {
  console.log('Running initial analysis...');

  // プロジェクト構造を読み込み
  let projectStructure = '';
  try {
    projectStructure = fs.readFileSync('project-structure.txt', 'utf8');
  } catch (e) {
    projectStructure = '(構造情報を取得できませんでした)';
  }

  // プロンプト構築
  const prompt = `
あなたはソフトウェアエンジニアです。以下のIssueを分析し、実装計画を立ててください。

## Issue情報
タイトル: ${ISSUE_TITLE}
Issue番号: #${ISSUE_NUMBER}

### Issue本文
${ISSUE_BODY}

## プロジェクト構造
${projectStructure}

## 分析タスク
以下の形式でMarkdown出力してください:

### :mag: 要件の整理
- Issueの要件を具体的に箇条書きで整理

### :file_folder: 修正候補ファイル
- 修正が必要と思われるファイルをリストアップ（理由付き）
- ファイルパスは src/ から始まる相対パスで記載

### :clipboard: 実装プラン
1. ステップバイステップの実装計画
2. 各ステップで何をするか具体的に記載

### :warning: 注意点・確認事項
- 実装時に注意すべき点
- 不明点や確認が必要な事項

---
*この分析は Gemini API によって自動生成されました*
`;

  return callGeminiAPI(prompt);
}

/**
 * 再分析
 */
async function reanalyzeIssue(issueNumber) {
  console.log('Running reanalysis...');

  // Issueの情報を取得
  const issue = await getIssue(issueNumber);
  const issueTitle = issue.title;
  const issueBody = issue.body;

  // コメント履歴を取得
  const comments = await getIssueComments(issueNumber);

  // botのコメント（過去の分析結果）を除外し、ユーザーのコメントのみ抽出
  const userComments = comments
    .filter(c => !c.user.login.includes('[bot]') && !c.body.startsWith('## :robot: Issue分析レポート'))
    .map(c => `**${c.user.login}** (${c.created_at}):\n${c.body}`)
    .join('\n\n---\n\n');

  // プロジェクト構造を読み込み
  let projectStructure = '';
  try {
    projectStructure = fs.readFileSync('project-structure.txt', 'utf8');
  } catch (e) {
    projectStructure = '(構造情報を取得できませんでした)';
  }

  // プロンプト構築（コメント履歴を含める）
  const prompt = `
あなたはソフトウェアエンジニアです。以下のIssueを再分析し、実装計画を更新してください。

## Issue情報
タイトル: ${issueTitle}
Issue番号: #${issueNumber}

### Issue本文
${issueBody}

### コメント履歴（ユーザーからのフィードバック）
${userComments || '(コメントなし)'}

## プロジェクト構造
${projectStructure}

## 再分析タスク
**重要**: コメント履歴に含まれる修正要求や追加情報を反映して、実装計画を更新してください。

以下の形式でMarkdown出力してください:

### :mag: 要件の整理（更新）
- コメントでの修正内容を反映した要件
- 変更点があれば明示

### :file_folder: 修正候補ファイル
- 修正が必要と思われるファイルをリストアップ（理由付き）
- ファイルパスは src/ から始まる相対パスで記載

### :clipboard: 実装プラン（更新）
1. ステップバイステップの実装計画
2. 各ステップで何をするか具体的に記載

### :warning: 注意点・確認事項
- 実装時に注意すべき点
- 不明点や確認が必要な事項

---
*この再分析は Gemini API によって自動生成されました*
`;

  return callGeminiAPI(prompt);
}

/**
 * メイン処理
 */
async function main() {
  try {
    let result;

    // イベントタイプで初回分析か再分析かを判定
    if (EVENT_NAME === 'issues') {
      // 初回分析
      result = await analyzeNewIssue();
    } else if (EVENT_NAME === 'issue_comment') {
      // 再分析
      result = await reanalyzeIssue(COMMENT_ISSUE_NUMBER);
    } else {
      throw new Error(`Unknown event name: ${EVENT_NAME}`);
    }

    // 結果をファイルに出力
    const output = EVENT_NAME === 'issues'
      ? `## :robot: Issue分析レポート\n\n${result}`
      : `## :robot: Issue再分析レポート\n\n${result}`;

    fs.writeFileSync('analysis-result.md', output);
    console.log('Analysis completed successfully');
  } catch (error) {
    console.error('Error:', error.message);

    // エラー時のフォールバック出力
    const issueNumber = ISSUE_NUMBER || COMMENT_ISSUE_NUMBER;
    const fallback = `## :robot: Issue分析レポート

:warning: **自動分析でエラーが発生しました**

Issue #${issueNumber} の分析中にエラーが発生しました。
手動での確認をお願いします。

エラー: ${error.message}

---
*Gemini API Key が正しく設定されているか確認してください*
`;
    fs.writeFileSync('analysis-result.md', fallback);

    // ワークフローは継続させる（失敗としない）
    process.exit(0);
  }
}

main();
