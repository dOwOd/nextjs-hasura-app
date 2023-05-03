import { FC } from 'react'
import { GetServerSideProps } from 'next'
import { initializeApollo } from 'lib/apolloClient'
import { GET_ARTICLE_BY_SLUG } from 'src/queries/queries'
import { GetArticleBySlugQuery, Articles } from 'src/gql/graphql'
import { Layout } from 'src/components/Layout'
import { BreadCrumb } from 'src/components/BreadCrumb'
import { dateFromat } from 'lib/utils/DateFormat'

interface Props {
  article: {
    __typename?: 'articles'
  } & Pick<
    Articles,
    'id' | 'slug' | 'title' | 'content' | 'status' | 'created_at' | 'updated_at'
  >
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<GetArticleBySlugQuery>({
    query: GET_ARTICLE_BY_SLUG,
    variables: { slug: query.slug },
  })
  return {
    props: {
      article: data.articles[0],
    },
  }
}

const Article: FC<Props> = ({ article }) => {
  if (!article) {
    return <>Loading...</>
  }

  return (
    <Layout title={article.title}>
      <BreadCrumb />
      <article>
        <hgroup>
          <h1>{article.title}</h1>
          <h6>created_at: {dateFromat(article.created_at)}</h6>
        </hgroup>
        {article.content}
      </article>
    </Layout>
  )
}

export default Article
