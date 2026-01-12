import { initializeApollo } from 'src/lib/apolloClient'
import { GET_ARTICLE_BY_SLUG } from 'src/queries/queries'
import { GetArticleBySlugQuery } from 'src/gql/graphql'
import { Article } from 'src/components/Article'
import { Modal } from 'src/components/Modal'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    slug: string
  }>
}

const InterceptedBlogPage = async (props: Props) => {
  const params = await props.params
  const { data } = await initializeApollo().query<GetArticleBySlugQuery>({
    query: GET_ARTICLE_BY_SLUG,
    variables: { slug: params.slug },
    context: {
      fetchOptions: {
        next: { revalidate: 1 },
      },
    },
  })

  const article = data?.articles[0]
  if (!article) return notFound()

  return (
    <Modal>
      <Article article={article} />
    </Modal>
  )
}

export default InterceptedBlogPage
