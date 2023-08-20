import { initializeApollo } from 'src/lib/apolloClient'
import { GET_ARTICLE_BY_SLUG } from 'src/queries/queries'
import { GetArticleBySlugQuery } from 'src/gql/graphql'
import Modal from 'src/components/Modal'
import { Article } from 'src/components/Article'

type Props = {
  params: {
    slug: string
  }
}

const Page = async ({ params }: Props) => {
  const { data } = await initializeApollo().query<GetArticleBySlugQuery>({
    query: GET_ARTICLE_BY_SLUG,
    variables: { slug: params.slug },
  })

  const article = data.articles[0]
  console.log('aaaaaaaaaaaaaaaaaa')

  return (
    <Modal>
      <Article article={article} />
    </Modal>
  )
}

export default Page
