import { Metadata } from 'next'
import { initializeApollo } from 'src/lib/apolloClient'
import { GET_ARTICLE_BY_SLUG, GET_ARTICLES_BY_STATUS } from 'src/queries/queries'
import { GetArticleBySlugQuery, GetArticlesByStatusQuery } from 'src/gql/graphql'
import { Article } from 'src/components/Article'
import { PageTitle } from 'src/components/PageTitle'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const { data } = await initializeApollo().query<GetArticlesByStatusQuery>({
    query: GET_ARTICLES_BY_STATUS,
    variables: { status: 'public' },
  })

  return data?.articles.map((article) => ({
    slug: article.slug,
  })) ?? []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await initializeApollo().query<GetArticleBySlugQuery>({
    query: GET_ARTICLE_BY_SLUG,
    variables: { slug },
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
  const { slug } = await params
  const { data } = await initializeApollo().query<GetArticleBySlugQuery>({
    query: GET_ARTICLE_BY_SLUG,
    variables: { slug },
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
