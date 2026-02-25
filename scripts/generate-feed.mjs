import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const HASURA_URL = process.env.HASURA_URL
const HASURA_KEY = process.env.HASURA_KEY

if (!HASURA_URL || !HASURA_KEY) {
  console.error('Error: HASURA_URL and HASURA_KEY must be set')
  process.exit(1)
}

const query = `
  query GetPublicArticles {
    articles(
      where: { status: { _eq: "public" } }
      order_by: { created_at: desc }
    ) {
      slug
      title
      content
      updated_at
      created_at
    }
  }
`

const response = await fetch(HASURA_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': HASURA_KEY,
  },
  body: JSON.stringify({ query }),
})

if (!response.ok) {
  console.error(`Error: Hasura API returned ${response.status}`)
  process.exit(1)
}

const { data, errors } = await response.json()

if (errors) {
  console.error('GraphQL errors:', errors)
  process.exit(1)
}

const articles = data.articles

const escapeXml = (str) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const extractDescription = (markdown, length = 200) => {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_~>]+/g, '')
    .replace(/\n+/g, ' ')
    .trim()

  if (plainText.length <= length) return plainText
  return plainText.slice(0, length) + '…'
}

const siteUrl = 'https://dowo.dev'
const feedUpdated =
  articles.length > 0
    ? new Date(articles[0].updated_at).toISOString()
    : new Date().toISOString()

const entries = articles
  .map((article) => {
    const createdDate = article.created_at.split('T')[0]
    const summary = extractDescription(article.content)

    return `  <entry>
    <title>${escapeXml(article.title)}</title>
    <link href="${siteUrl}/blog/${escapeXml(article.slug)}" rel="alternate" />
    <id>tag:dowo.dev,${createdDate}:${escapeXml(article.slug)}</id>
    <updated>${new Date(article.updated_at).toISOString()}</updated>
    <published>${new Date(article.created_at).toISOString()}</published>
    <summary>${escapeXml(summary)}</summary>
    <author>
      <name>dOwOd</name>
    </author>
  </entry>`
  })
  .join('\n')

const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>dOwOd's logs</title>
  <link href="${siteUrl}" rel="alternate" />
  <link href="${siteUrl}/feed.xml" rel="self" />
  <id>${siteUrl}/</id>
  <updated>${feedUpdated}</updated>
  <author>
    <name>dOwOd</name>
  </author>
${entries}
</feed>
`

const outputPath = resolve(root, 'out/feed.xml')
writeFileSync(outputPath, atom, 'utf-8')
console.log(`Generated: ${outputPath}`)
