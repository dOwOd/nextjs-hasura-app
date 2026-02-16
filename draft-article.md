# 🏗️ ISRをやめてSSGにした話

## tl;dr

ISR + NextAuth + 自作 CMS + Vercel のフルスタック構成から、SSG + Cloudflare Pages のシンプルな静的サイトに移行した。認証も記事管理も全部削除して、ビルド時に HTML を生成して配信するだけの構成に。

![移行前のアーキテクチャ: Vercel上のNext.js 15でISR・NextAuth認証・記事管理を含むフルスタック構成](/images/isr-to-ssg/architecture-before.svg)

![移行後のアーキテクチャ: Directus CMSからCloudflare Pages経由で静的配信するSSG構成](/images/isr-to-ssg/architecture-after.svg)

---

このブログは、もともとISR（Incremental Static Regeneration）で動いていた。 `Next.js + Hasura GraphQL + PostgreSQL` という構成で、[NextAuth](https://next-auth.js.org/)による認証や記事管理の CRUD、[Intercepting Routes](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes)まで入ったやりたいこと全部盛り構成だった。

今回それを全部やめてSSG（Static Site Generation）にした。ビルド時にHTMLを生成してCloudflare Pagesに置くだけ。その経緯をまとめておきます。

## なんでそんな構成だったのか

もともとの動機はシンプルで、**ISRを実践で使ってみたかった**から。Next.jsの特徴的な機能だし、業務で触る前に自分のブログで試しておきたかった。

あと、業務でCMS開発に携わることがあって、プライベートでも自作CMSを運用してみたかった。HasuraがPostgreSQL の前段に入ってGraphQL APIを提供してくれるので、バックエンドのコード量は最小限で済む。

当時のアーキテクチャはこんな感じだった。

![移行前のアーキテクチャ: Vercel上のNext.js 15でISR・NextAuth認証・記事管理を含むフルスタック構成](/images/isr-to-ssg/architecture-before.svg)

閲覧者と管理者の両方がCloudflare CDN経由でVercelにアクセスする構成。Next.js内にISR、NextAuth 認証、記事管理が同居していて、Apollo Client経由でHasura GraphQL → PostgreSQLに繋がっている。ただのブログにしてはちょっとやりすぎ。

## 理想と実態のギャップ

で、実際どうだったか。

記事の執筆フローが「Markdownを別のエディタで書いて、自作CMSにコピペする」という運用になっていた。CMSの記事エディタも使い心地が良くなく、最初に実装して以来一度も改修してない。改善のモチベーションがまったく湧かなかった。

そもそも記事の更新頻度が年に数回。ISRの「リクエスト時に再生成」という仕組み、年数回の更新に対して完全にオーバーエンジニアリングだった。ビルド時に全ページ生成すれば十分じゃんと考えた。

自作CMSも結局コピペ先としてしか使っていないならCMSである必要がない。

## 移行のきっかけ

Vercelの機能はそれなりに使っていた。ISR、`next/image` の最適化、`@vercel/analytics`。でもSSGブログに本当に必要だったかというと、どれもなくて困らないものばかりだった。むしろ気づけば Vercel のランタイムに依存した機能がコードベースに散らばっていて、Vercelなしでは動かない状態になっていた。将来ホスティング先を変えたくなったときに、移行コストが膨らむ一方だと感じた。

**サイトの構成をシンプルにしたかった。** これが一番の動機だと思う。

移行先はCloudflare Pages。Pages + R2 + DNS + Deploy Hooks と、Cloudflare エコシステムに統一することで拡張性も確保できる。

### Vercel Hobby vs Cloudflare Pages Free

公式ドキュメントベースで比較するとこんな感じ。

| 項目           | Vercel Hobby                                                                      | Cloudflare Pages Free                                                |
| -------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 商用利用       | [非商用のみ](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage) | 制限の記載なし                                                       |
| 帯域幅         | [100 GB/月](https://vercel.com/docs/limits/fair-use-guidelines)                   | [無制限](https://developers.cloudflare.com/pages/platform/limits/)   |
| アナリティクス | [50,000 イベント/月](https://vercel.com/docs/analytics/limits-and-pricing)        | [無制限・無料](https://www.cloudflare.com/web-analytics/)            |
| ビルド回数     | [制限なし（100時間/月）](https://vercel.com/docs/limits)                          | [500回/月](https://developers.cloudflare.com/pages/platform/limits/) |
| デプロイ回数   | [100回/日](https://vercel.com/docs/limits)                                        | [無制限](https://developers.cloudflare.com/pages/platform/limits/)   |

静的サイトを無料でホスティングするなら Cloudflare Pagesで十分と判断。

## 移行でやったこと

移行は 7 フェーズに分けて進めた。全部書くと長くなりすぎるので要点だけ。

**Phase 1 - 移行方針の検討**: ISRのメリットを活かせていなかった。記事の更新頻度は年に数回で、リクエスト時に再生成する仕組みは不要。それならSSGにして静的ファイルを配信するだけの構成にすることを決定。

**Phase 2 - 計画立案**: 作業順序の策定。何を消して何を残すか整理。

**Phase 3 - SSG 化実装**: ここが一番大きい。NextAuthの認証、記事管理のCRUDページ、Intercepting Routeを全部削除。`next.config.js` に `output: 'export'` を設定して、`images` に `unoptimized: true` を追加。これでNext.jsが純粋な静的サイトジェネレーターになる。`generateStaticParams` でビルド時に全記事のパスを生成して、Apollo ClientでHasuraから記事データを取得する流れだけは残す。

**Phase 4 - デプロイ構成**: Cloudflare PagesのGit連携でpush時に自動デプロイ。加えてGitHub Actionsの `workflow_dispatch` で手動リビルドもできるように。ワークフロー内では `wrangler pages deploy out/` で静的ファイルをアップロード。

**Phase 5 - Vercel 完全離脱**: `@vercel/analytics` 等のVercel関連パッケージと設定を全削除。Cloudflare DNSの向き先をVercelからCloudflare Pagesに切り替え。

**Phase 6 - 記事管理方針**: HasuraのPostgreSQLはそのまま維持しつつ、記事の編集は[Directus](https://directus.io/) CMSに移行する方針に決定。自作CMSにさよなら 👋。

**Phase 7 - 自動リビルド**: 最初はGitHub Actionsの `repository_dispatch` で自動リビルドを組もうとしたが、CloudflareのDeploy Hooks方式に変更した。Directus FlowsからWebhookを飛ばしてリビルドをトリガーする流れ。既に別プロジェクトでGitHub Actionsを動かし過ぎて月の無料枠に達し、全リポジトリでActionsが使えなくなっていたのが正直な理由。結果としてCloudflare側で完結するほうがシンプルだなとも思った。

## ハマりどころ

いくつか技術的にハマったポイントを記録しておく。

### Apollo Client v3 → v4 の破壊的変更

これはSSG移行とは直接関係ない。移行作業の少し前にRenovateがv4のアップグレードPRを作ってくれて、対応したらビルドが出来なくなった。v3のままでもSSG化自体は問題なくできたはずだけど、タイミング的に重なったので一緒に片付けた形。

<!-- TODO: rxjs の Module not found エラーのスクリーンショット -->

まず `Module not found: Can't resolve 'rxjs'` で落ちる。Apollo Client v4は内部の Observable 実装を `zen-observable-ts` から [RxJS に置き換えた](https://github.com/apollographql/apollo-client/pull/12384)ため、`rxjs` が必須のpeer dependencyになった。

次に[インポートパスの変更](https://www.apollographql.com/docs/react/migrating/apollo-client-4-migration)。React hooks 系のインポート先が `@apollo/client` から `@apollo/client/react` に変わっていて、全ファイルで書き換えが発生した。GraphQL Code Generatorを使っている場合は `codegen.ts` にも設定が必要:

```typescript
config: {
  apolloReactHooksImportFrom: '@apollo/client/react',
},
```

あと [`ApolloClient` の型が非ジェネリックになった](https://www.apollographql.com/docs/react/migrating/apollo-client-4-migration)。`ApolloClient<NormalizedCacheObject>` → `ApolloClient` に変わるので、Apollo Clientインスタンスの型定義も修正が必要。

<!-- TODO: Type 'ApolloClient' is not generic. のエラー -->

エラーメッセージ自体は分かりやすくて助かった。どれもマイグレーションガイドに目を通してからアップグレードしていればハマらなかった話ではある。

## Before / After

| 項目         | Before                 | After                                      |
| ------------ | ---------------------- | ------------------------------------------ |
| レンダリング | ISR                    | SSG                                        |
| ホスティング | Vercel                 | Cloudflare Pages                           |
| 認証         | NextAuth               | なし                                       |
| 記事管理     | 自作 CMS               | Directus CMS（計画中）                     |
| バンドラー   | Webpack                | Turbopack                                  |
| ドメイン管理 | Vercel + 外部 DNS      | Cloudflare DNS                             |
| デプロイ     | Git push → Vercel 自動 | Git push → Cloudflare Pages + Deploy Hooks |

## 今のアーキテクチャ

![移行後のアーキテクチャ: Directus CMSからCloudflare Pages経由で静的配信するSSG構成](/images/isr-to-ssg/architecture-after.svg)

Cloudflare のエコシステム（Pages + R2 + DNS + Deploy Hooks）に寄せたことで、全体がスッキリした。Hasura と PostgreSQL はそのまま残しているので、データ層の柔軟性は維持できている。

サーバーランタイムは不要。ビルドして `out/` に吐かれた静的ファイルをそのまま配信するだけ。

## 自作 CMS から Directus へ（Directusという選択肢）

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

ちなみに、移行中のダウンタイムはゼロだった。Cloudflare Pages の Git 連携で新環境を先に立ち上げて、`*.pages.dev` で動作確認してから DNS を切り替え、最後に Vercel を停止する順番で進めたので、サイトが見れない時間は発生していない。Cloudflare DNS なら切り替えも即時反映されるし、並行運用期間を設けておけば安心。

オーバーエンジニアリングに気づいて、ちゃんとシンプルにできたのは良かったと思う。ただ、ISR も自作 CMS も Intercepting Route も、気になった機能を実際に触って試せたこと自体は無駄じゃなかった。使ってみて初めて「これは自分のユースケースには合わない」と判断できるようになるし、技術選定を失敗したと思える経験ができたのは大きい。失敗しないとわからないことって結構ある。

では。
