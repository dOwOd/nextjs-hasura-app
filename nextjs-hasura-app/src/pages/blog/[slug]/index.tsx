import { FC } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { initializeApollo } from 'src/lib/apolloClient'
import {
  GET_ARTICLE_BY_SLUG,
  GET_ARTICLES_BY_STATUS,
} from 'src/queries/queries'
import {
  GetArticleBySlugQuery,
  GetArticlesByStatusQuery,
  Articles,
} from 'src/gql/graphql'
import { Layout } from 'src/components/Layout'
import { BreadCrumb } from 'src/components/BreadCrumb'
import { dateFromat } from 'src/lib/utils/DateFormat'
import { markdownToReactElement } from 'src/lib/utils/markdownToReactElement'

interface Props {
  article: {
    __typename?: 'articles'
  } & Pick<
    Articles,
    'id' | 'slug' | 'title' | 'content' | 'status' | 'created_at' | 'updated_at'
  >
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<GetArticlesByStatusQuery>({
    query: GET_ARTICLES_BY_STATUS,
    variables: { status: 'public' },
  })
  const paths = data.articles.map(({ slug }) => ({
    params: {
      slug: slug,
    },
  }))
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo()

  if (params !== undefined) {
    const { data } = await apolloClient.query<GetArticleBySlugQuery>({
      query: GET_ARTICLE_BY_SLUG,
      variables: { slug: params.slug },
    })
    return {
      props: {
        article: data.articles[0],
      },
      revalidate: 1,
    }
  }

  return {
    props: { error: true },
  }
}

const Index: FC<Props> = ({ article }) => {
  if (!article) {
    return <>Loading...</>
  }
  const content = markdownToReactElement(article.content)

  return (
    <Layout>
      <BreadCrumb />
      <article>
        <hgroup>
          <h1>{article.title}</h1>
          <h6>created_at: {dateFromat(article.created_at)}</h6>
        </hgroup>
        <div>{content}</div>
      </article>
    </Layout>
  )
}

export default Index
