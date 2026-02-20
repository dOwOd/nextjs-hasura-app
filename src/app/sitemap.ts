export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'
import { initializeApollo } from 'src/lib/apolloClient'
import { GET_ARTICLES_BY_STATUS } from 'src/queries/queries'
import { GetArticlesByStatusQuery } from 'src/gql/graphql'

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const { data } = await initializeApollo().query<GetArticlesByStatusQuery>({
    query: GET_ARTICLES_BY_STATUS,
    variables: { status: 'public' },
  })

  const articles = data?.articles ?? []

  return [
    {
      url: 'https://dowo.dev',
      lastModified: articles[0]?.updated_at,
    },
    ...articles.map((article) => ({
      url: `https://dowo.dev/blog/${article.slug}`,
      lastModified: article.updated_at,
    })),
  ]
}

export default sitemap
