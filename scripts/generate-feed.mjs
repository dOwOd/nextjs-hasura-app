import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Feed } from 'feed'

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
const siteUrl = 'https://dowo.dev'

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

const feed = new Feed({
  title: "dOwOd's logs",
  description: 'dOwOdの技術ブログ。Web開発や日常について書いています。',
  id: `${siteUrl}/`,
  link: siteUrl,
  feedLinks: {
    atom: `${siteUrl}/feed.xml`,
  },
  author: { name: 'dOwOd' },
  updated:
    articles.length > 0 ? new Date(articles[0].updated_at) : new Date(),
})

for (const article of articles) {
  feed.addItem({
    title: article.title,
    id: `${siteUrl}/blog/${article.slug}`,
    link: `${siteUrl}/blog/${article.slug}`,
    description: extractDescription(article.content),
    date: new Date(article.updated_at),
    published: new Date(article.created_at),
    author: [{ name: 'dOwOd' }],
  })
}

const outputPath = resolve(root, 'out/feed.xml')
writeFileSync(outputPath, feed.atom1(), 'utf-8')
console.log(`Generated: ${outputPath}`)
