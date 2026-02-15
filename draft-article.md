# 🏗️ ISRをやめてSSGにした話 ― ブログをシンプルにするまでの道のり

このブログ、もともと ISR（Incremental Static Regeneration）で動いていた。Next.js + Hasura GraphQL + PostgreSQL というなかなかガチな構成で、NextAuth による認証や記事管理の CRUD、Intercepting Route まで入ったフルスタック構成だった。

今回それを全部やめて SSG（Static Site Generation）にした。ビルド時に HTML を全部生成して Cloudflare Pages に置くだけ。その経緯をまとめておきます。

## なんでそんな構成だったのか

もともとの動機はシンプルで、**ISR を実践で使ってみたかった**から。Next.js の特徴的な機能だし、業務で触る前に自分のブログで試しておきたかった。

あと、業務で CMS 開発に携わることがあって、プライベートでも自作 CMS を運用してみたかった。DB 設計からバックエンド実装まで自分でやれるブログって、開発の練習としてはかなり良い題材だと思う。Hasura を使えば GraphQL API が PostgreSQL の上にサッと立つので、バックエンドのコード量は最小限で済むし。

## 理想と実態のギャップ

で、実際どうだったかというと。

記事の執筆フローが「Markdown を別のエディタで書いて、自作 CMS にコピペする」という運用になっていた。CMS の記事エディタ、最初に実装して以来一度も改修してない。改善のモチベーションがまったく湧かなかった。

そもそも記事の更新頻度が年に数回。ISR の「リクエスト時に再生成」という仕組み、年数回の更新に対して完全にオーバーエンジニアリングだった。ビルド時に全ページ生成すれば十分じゃん、という。

自作 CMS も結局コピペ先としてしか使っていないなら、それ CMS である必要ある？

## 移行のきっかけ

直接のきっかけは Vercel Hobby プランの商用利用制限だった。

ただ、本質はそこじゃない。冷静に考えると、Vercel の豊富な機能をほとんど使っていなかった。SSG ブログに Edge Functions も ISR も Server Actions もいらない。Vercel のビルド出力は非公開フォーマットだし、`@vercel/*` パッケージへの依存も増えていく。プラットフォームに縛られている感じがしていた。

**サイトをシンプルにしたかった。** これが一番の動機だと思う。

移行先は Cloudflare Pages。Pages + R2 + DNS + Deploy Hooks と、Cloudflare エコシステムに統一することで拡張性も確保できる。

### Vercel Hobby vs Cloudflare Pages Free

公式ドキュメントベースで比較するとこんな感じ。

| 項目 | Vercel Hobby | Cloudflare Pages Free |
|---|---|---|
| 商用利用 | 非商用のみ | 制限なし |
| 帯域幅 | 100 GB/月 | 無制限 |
| DDoS 保護 | Pro 以上（$20/月〜） | 無料で標準装備 |

静的サイトを無料でホスティングするなら Cloudflare Pages、かなり強い。

## 移行でやったこと

移行は 9 フェーズに分けて進めた。全部書くと長くなりすぎるので要点だけ。

**Phase 1 - 基盤整備**: Next.js 16 と Apollo Client 4 へのアップグレード。移行作業の土台づくり。Apollo Client は v3 から v4 でインポートパスが変わったので、コード全体の書き換えが発生した。

**Phase 2 - 移行方針の検討**: 最初は [OpenNext](https://opennext.js.org/) を使って Cloudflare 上で ISR を維持する方向で検討した。でも OpenNext だと Cloudflare Pages の Git 連携（push したら自動デプロイ）が使えないことがわかって断念。方針転換して完全 SSG 化に舵を切った。

**Phase 3 - 計画立案**: 作業順序の策定。何を消して何を残すか整理した。

**Phase 4 - SSG 化実装**: ここが一番大きい。NextAuth の認証、記事管理の CRUD ページ、Intercepting Route を全部削除。`next.config.js` に `output: 'export'` を設定して、`images` に `unoptimized: true` を追加。これで Next.js が純粋な静的サイトジェネレーターになる。`generateStaticParams` でビルド時に全記事のパスを生成して、Apollo Client で Hasura から記事データを取得する流れだけが残った。

**Phase 5 - デプロイ構成**: Cloudflare Pages の Git 連携で push 時に自動デプロイ。加えて GitHub Actions の `workflow_dispatch` で手動リビルドもできるようにした。ワークフロー内では `wrangler pages deploy out/` で静的ファイルをアップロードしている。

**Phase 6 - Turbopack 対応**: Next.js 16 はデフォルトのバンドラーが Turbopack になったんだけど、Apollo Client 4 との組み合わせでハマった。`next.config.js` に `transpilePackages: ['@apollo/client']` を追加することで解決。これ、ドキュメントに書いてなくて地味にキツかった。

**Phase 7 - Vercel 完全離脱**: `@vercel/analytics` 等の Vercel 関連パッケージと設定を全削除。dowo.dev ドメインも Cloudflare DNS に移行した。

**Phase 8 - 記事管理方針**: Hasura の PostgreSQL はそのまま維持しつつ、記事の編集は [Directus](https://directus.io/) CMS に移行する方針に決定。自作 CMS にさよなら。

**Phase 9 - 自動リビルド**: 最初は GitHub Actions の `repository_dispatch` で自動リビルドを組もうとしたけど、結局 Cloudflare の Deploy Hooks 方式に変更した。Directus Flows から Webhook を飛ばしてリビルドをトリガーする流れ。GitHub Actions の無料枠を消費しなくて済むし、Cloudflare 側で完結するほうがシンプル。

## ハマりどころ

いくつか技術的にハマったポイントを記録しておく。

### OpenNext の制約

Cloudflare Pages の Git 連携が使えない。つまり push しても自動デプロイされない。`wrangler pages deploy` を自前で叩く必要がある。Git 連携で自動デプロイできるのが Cloudflare Pages の良さなのに、それが使えないのは本末転倒だった。SSG に方針転換した最大の理由。

### Turbopack + Apollo Client 4

`transpilePackages` の設定が必要。Turbopack がモジュール解決の仕方を変えたのが原因っぽい。エラーメッセージからは原因が読み取りづらくて、解決までに結構時間がかかった。

最終的な `next.config.js` はこうなっている:

```js
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  transpilePackages: ['@apollo/client'],
  images: {
    unoptimized: true,
  },
}
```

### `output: 'export'` の制約

Intercepting Route が使えない、`rewrites` / `redirects` が使えない、`next/image` の最適化が使えない（`unoptimized: true` が必要）。わかっていたけど、実際に削除していくと結構な量になった。

### repository_dispatch から Deploy Hooks へ

最初は GitHub Actions で `repository_dispatch` イベントを受けてリビルドする構成にしていた。一度マージまでしたけど、よく考えると GitHub Actions の無料枠を毎回消費するのが微妙で、すぐ revert した。Cloudflare の Deploy Hooks なら Cloudflare 側で完結する。

## Before / After

| 項目 | Before | After |
|---|---|---|
| レンダリング | ISR | SSG（`output: 'export'`） |
| ホスティング | Vercel | Cloudflare Pages |
| 認証 | NextAuth | なし |
| 記事管理 | 自作 CMS | Directus CMS（計画中） |
| バンドラー | Webpack | Turbopack |
| ドメイン管理 | Vercel + 外部 DNS | Cloudflare DNS |
| デプロイ | Git push → Vercel 自動 | Git push → Cloudflare Pages + Deploy Hooks |

## 今のアーキテクチャ

```
Directus CMS → Hasura PostgreSQL → Next.js SSG (generateStaticParams) → Cloudflare Pages
```

Cloudflare のエコシステム（Pages + R2 + DNS + Deploy Hooks）に寄せたことで、全体がスッキリした。Hasura と PostgreSQL はそのまま残しているので、データ層の柔軟性は維持できている。

サーバーランタイムは不要。ビルドして `out/` に吐かれた静的ファイルをそのまま配信するだけ。

## 自作 CMS から Directus へ

自作 CMS をやめて Directus CMS に移行することにした。地味に大きな変化。

自作 CMS は「作ること自体が目的」みたいなところがあって、実用性は正直微妙だった。Directus は既存の PostgreSQL にそのまま接続できるので、DB スキーマを変えずに CMS だけ乗り換えられる。管理画面も最初からちゃんとしているし、Webhook（Directus Flows）で外部連携もできる。

自分で全部作りたいという気持ちはあったけど、使うツールと作るツールは分けたほうがいい。

## 今後やりたいこと

- タグ機能の追加
- OGP 画像の対応
- ダークモード

どれも「あったらいいな」レベルなので、気が向いたらやる。

## おわりに

ISR + 自作 CMS + Vercel という「できることが多い構成」から、SSG + Directus + Cloudflare Pages という「必要十分な構成」に移行した。機能は減ったけど、運用はラクになったし、コードもシンプルになった。

オーバーエンジニアリングに気づいて、ちゃんとシンプルにできたのは良かったと思う。技術選定は「使ってみたい」だけで決めると、後で自分が困る。まあ、困ったからこそ学べたところもあるんですけどね。

では。
