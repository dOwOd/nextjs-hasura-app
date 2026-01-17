import { initializeApollo } from 'src/lib/apolloClient'
import { GET_ARTICLE_BY_SLUG } from 'src/queries/queries'
import { GetArticleBySlugQuery } from 'src/gql/graphql'
import { Article } from 'src/components/Article'
import { Modal } from 'src/components/Modal'
import { ArticleModalProvider } from 'src/lib/context/ArticleModalContext'
import { notFound } from 'next/navigation'

type Props = {
  params: {
    slug: string
  }
}

const InterceptedBlogPage = async ({ params }: Props) => {
  const { data } = await initializeApollo().query<GetArticleBySlugQuery>({
    query: GET_ARTICLE_BY_SLUG,
    variables: { slug: params.slug },
  })

  const article = data?.articles[0]
  if (!article) return notFound()

  return (
    <Modal>
      <ArticleModalProvider>
        <Article article={article} />
      </ArticleModalProvider>
    </Modal>
  )
}

export default InterceptedBlogPage
