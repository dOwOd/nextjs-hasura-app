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

export const generateStaticParams = async () => {
  const { data } = await initializeApollo().query<GetArticlesByStatusQuery>({
    query: GET_ARTICLES_BY_STATUS,
    variables: { status: 'public' },
  })
  if (!data) return []
  return data.articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
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

const Page = async (props: Props) => {
  const params = await props.params;
  const { data } = await initializeApollo().query<GetArticleBySlugQuery>({
    query: GET_ARTICLE_BY_SLUG,
    variables: { slug: params.slug },
  })

  const article = data?.articles[0]
  if (!article) return notFound()


  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    datePublished: article.created_at,
    dateModified: article.updated_at,
    author: { '@type': 'Person', name: 'dOwOd', url: 'https://dowo.dev' },
    url: `https://dowo.dev/blog/${params.slug}`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://dowo.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: article.title,
        item: `https://dowo.dev/blog/${params.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PageTitle title={article.title} />
      <Article article={article} />
    </>
  )
}

export default Page
