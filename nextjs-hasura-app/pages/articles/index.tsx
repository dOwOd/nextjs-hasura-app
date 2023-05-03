import { FC } from 'react'
import { Layout } from '../../components/Layout'
import { GetServerSideProps } from 'next'
import { initializeApollo } from '../../lib/apolloClient'
import { GetArticlesByStatusQuery, Articles } from '../../src/gql/graphql'
import { GET_ARTICLES_BY_STATUS } from '../../queries/queries'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<GetArticlesByStatusQuery>({
    query: GET_ARTICLES_BY_STATUS,
    variables: { status: 'public' },
  })
  return {
    props: {
      articles: data.articles,
    },
  }
}

interface Props {
  articles: {
    __typename?: 'articles'
  } & Pick<Articles, 'id' | 'slug' | 'title' | 'created_at' | 'updated_at'>[]
}
const Article: FC<Props> = ({ articles }) => {
  if (!articles) {
    return <>Loading...</>
  }

  return (
    <Layout title="Articles">
      <div>
        {articles.map(({ id, slug, title, created_at }) => (
          <Link href={`/articles/${slug}`} key={id}>
            <article>
              title: {title}
            </article>
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export default Article
