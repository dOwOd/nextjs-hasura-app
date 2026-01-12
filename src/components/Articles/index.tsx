import { initializeApollo } from 'src/lib/apolloClient'
import { GetArticlesQuery } from 'src/gql/graphql'
import { GET_ARTICLES_BY_STATUS } from 'src/queries/queries'
import Link from 'next/link'

export const Articles = async () => {
  const result = await initializeApollo().query<GetArticlesQuery>({
    query: GET_ARTICLES_BY_STATUS,
    variables: { status: 'public' },
    context: {
      fetchOptions: {
        next: { revalidate: 1 },
      },
    },
  })
  const data = result.data as GetArticlesQuery

  return (
    <>
      {data.articles.map((article) => (
        <Link href={`/blog/${article.slug}`} key={article.id}>
          <article>{article.title}</article>
        </Link>
      ))}
    </>
  )
}