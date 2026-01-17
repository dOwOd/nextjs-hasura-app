import { Metadata } from 'next'
import { initializeApollo } from 'src/lib/apolloClient'
import { GET_ARTICLE_BY_SLUG } from 'src/queries/queries'
import { GetArticleBySlugQuery } from 'src/gql/graphql'
import { Article } from 'src/components/Article'
import { PageTitle } from 'src/components/PageTitle'
import { notFound } from 'next/navigation'

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await initializeApollo().query<GetArticleBySlugQuery>({
    query: GET_ARTICLE_BY_SLUG,
    variables: { slug: params.slug },
  })

  const article = data?.articles[0]
  if (!article) {
    return { title: 'Not Found' }
  }

  return {
    title: article.title,
  }
}

const Page = async ({ params }: Props) => {
  const { data } = await initializeApollo().query<GetArticleBySlugQuery>({
    query: GET_ARTICLE_BY_SLUG,
    variables: { slug: params.slug },
  })

  const article = data?.articles[0]
  if (!article) return notFound()


  return (
    <>
      <PageTitle title={article.title} />
      <Article article={article} />
    </>
  )
}

export default Page
