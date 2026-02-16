# 🏗️ ISRをやめてSSGにした話 ― ブログをシンプルにするまでの道のり

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

Vercelの機能はそれなりに使っていた。ISR、`next/image` の最適化、`@vercel/analytics`。でもSSGブログに本当に必要だったかというと、どれもなくて困らないものばかりだった。むしろ気づけば Vercel のランタイムに依存した機能がコードベースに散らばっていて、Vercel なしでは動かない状態になっていた。将来ホスティング先を変えたくなったときに、移行コストが膨らむ一方だと感じた。

**サイトをシンプルにしたかった。** これが一番の動機だと思う。

移行先はCloudflare Pages。Pages + R2 + DNS + Deploy Hooks と、Cloudflare エコシステムに統一することで拡張性も確保できる。

### Vercel Hobby vs Cloudflare Pages Free

公式ドキュメントベースで比較するとこんな感じ。

| 項目      | Vercel Hobby         | Cloudflare Pages Free |
| --------- | -------------------- | --------------------- |
| 商用利用  | 非商用のみ           | 制限なし              |
| 帯域幅    | 100 GB/月            | 無制限                |
| DDoS 保護 | Pro 以上（$20/月〜） | 無料で標準装備        |

静的サイトを無料でホスティングするなら Cloudflare Pagesで十分と判断。

## 移行でやったこと

移行は 8 フェーズに分けて進めた。全部書くと長くなりすぎるので要点だけ。

**Phase 1 - 移行方針の検討**: 最初は [OpenNext](https://opennext.js.org/) を使って Cloudflare 上で ISR を維持する方向で検討した。でも OpenNext だと Cloudflare Pages の Git 連携（push したら自動デプロイ）が使えないことがわかって断念。方針転換して完全 SSG 化に舵を切った。

**Phase 2 - 計画立案**: 作業順序の策定。何を消して何を残すか整理した。

**Phase 3 - SSG 化実装**: ここが一番大きい。NextAuth の認証、記事管理の CRUD ページ、Intercepting Route を全部削除。`next.config.js` に `output: 'export'` を設定して、`images` に `unoptimized: true` を追加。これで Next.js が純粋な静的サイトジェネレーターになる。`generateStaticParams` でビルド時に全記事のパスを生成して、Apollo Client で Hasura から記事データを取得する流れだけが残った。

**Phase 4 - デプロイ構成**: Cloudflare Pages の Git 連携で push 時に自動デプロイ。加えて GitHub Actions の `workflow_dispatch` で手動リビルドもできるようにした。ワークフロー内では `wrangler pages deploy out/` で静的ファイルをアップロードしている。

**Phase 5 - Turbopack 対応**: Next.js 16 はデフォルトのバンドラーが Turbopack になったんだけど、Apollo Client 4 との組み合わせでハマった。`next.config.js` に `transpilePackages: ['@apollo/client']` を追加することで解決。これ、ドキュメントに書いてなくて地味にキツかった。

**Phase 6 - Vercel 完全離脱**: `@vercel/analytics` 等の Vercel 関連パッケージと設定を全削除。dowo.dev ドメインも Cloudflare DNS に移行した。

**Phase 7 - 記事管理方針**: Hasura の PostgreSQL はそのまま維持しつつ、記事の編集は [Directus](https://directus.io/) CMS に移行する方針に決定。自作 CMS にさよなら。

**Phase 8 - 自動リビルド**: 最初は GitHub Actions の `repository_dispatch` で自動リビルドを組もうとしたけど、結局 Cloudflare の Deploy Hooks 方式に変更した。Directus Flows から Webhook を飛ばしてリビルドをトリガーする流れ。GitHub Actions の無料枠を消費しなくて済むし、Cloudflare 側で完結するほうがシンプル。

## ハマりどころ

いくつか技術的にハマったポイントを記録しておく。

### OpenNext の制約

Cloudflare Pages の Git 連携が使えない。つまり push しても自動デプロイされない。`wrangler pages deploy` を自前で叩く必要がある。Git 連携で自動デプロイできるのが Cloudflare Pages の良さなのに、それが使えないのは本末転倒だった。SSG に方針転換した最大の理由。

### Apollo Client v3 → v4 の破壊的変更

これは SSG 移行とは直接関係ない。移行作業の少し前に Renovate が v4 のアップグレード PR を作ってくれて、対応したらビルドが出来なくなった。v3 のままでも SSG 化自体は問題なくできたはずだけど、タイミング的に重なったので一緒に片付けた形。

<!-- TODO: rxjs の Module not found エラーのスクリーンショット -->

まず `Module not found: Can't resolve 'rxjs'` で落ちる。Apollo Client v4 は rxjs を peer dependency として要求するようになっていて、明示的にインストールが必要だった。v3 では不要だったので完全に想定外。

次にインポートパスの変更。React hooks 系のインポート先が `@apollo/client` から `@apollo/client/react` に変わっていて、全ファイルで書き換えが発生した。GraphQL Code Generator を使っている場合は `codegen.ts` にも設定が必要:

```typescript
config: {
  apolloReactHooksImportFrom: '@apollo/client/react',
},
```

あと `ApolloClient` の型が非ジェネリックになった。`ApolloClient<NormalizedCacheObject>` → `ApolloClient` に変わるので、Apollo Client インスタンスの型定義も修正が必要。

エラーメッセージ自体は素直なので原因はわかるんだけど、修正箇所が多くて地味に大変だった。

### Turbopack + Apollo Client 4

<!-- TODO: Turbopack の Module not found エラーのスクリーンショット -->

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

| 項目         | Before                 | After                                      |
| ------------ | ---------------------- | ------------------------------------------ |
| レンダリング | ISR                    | SSG（`output: 'export'`）                  |
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
