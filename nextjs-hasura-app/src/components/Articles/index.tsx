import { initializeApollo } from 'src/lib/apolloClient'
import { GetArticlesQuery } from 'src/gql/graphql'
import { GET_ARTICLES_BY_STATUS } from 'src/queries/queries'
import Link from 'next/link'

export const Articles = async () => {
  const { data } = await initializeApollo().query<GetArticlesQuery>({
    query: GET_ARTICLES_BY_STATUS,
    variables: { status: 'public' },
    context: {
      fetchOptions: {
        next: { revalidate: 1 },
      },
    },
  })

  return (
    <>
      {data.articles.map(({ id, slug, title }) => (
        <Link href={`/blog/${slug}`} key={id}>
          <article>{title}</article>
        </Link>
      ))}
    </>
  )
}
