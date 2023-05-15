import { FC } from 'react'
import { Layout } from 'src/components/Layout'
import { GetStaticProps } from 'next'
import { initializeApollo } from 'src/lib/apolloClient'
import { GetArticlesByStatusQuery, Articles } from 'src/gql/graphql'
import { GET_ARTICLES_BY_STATUS } from 'src/queries/queries'
import { BreadCrumb } from 'src/components/BreadCrumb'
import Link from 'next/link'

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<GetArticlesByStatusQuery>({
    query: GET_ARTICLES_BY_STATUS,
    variables: { status: 'public' },
  })
  return {
    props: {
      articles: data.articles,
    },
    revalidate: 1,
  }
}

interface Props {
  articles: {
    __typename?: 'articles'
  } & Pick<Articles, 'id' | 'slug' | 'title' | 'created_at' | 'updated_at'>[]
}
const Article: FC<Props> = ({ articles }) => (
  <Layout title="Blog">
    <BreadCrumb />
    <div>
      {articles.map(({ id, slug, title }) => (
        <Link href={`/blog/${slug}`} key={id}>
          <article>title: {title}</article>
        </Link>
      ))}
    </div>
  </Layout>
)

export default Article
