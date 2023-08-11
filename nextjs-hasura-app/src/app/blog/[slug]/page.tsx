import { initializeApollo } from 'src/lib/apolloClient'
import { GET_ARTICLE_BY_SLUG } from 'src/queries/queries'
import { GetArticleBySlugQuery } from 'src/gql/graphql'
import { Layout } from 'src/components/Layout'
import { BreadCrumb } from 'src/components/BreadCrumb'
import { dateFromat } from 'src/lib/utils/DateFormat'
import { markdownToReactElement } from 'src/lib/utils/markdownToReactElement'

const Page = async ({ params }: { params: { slug: string } }) => {
  const { data } = await initializeApollo().query<GetArticleBySlugQuery>({
    query: GET_ARTICLE_BY_SLUG,
    variables: { slug: params.slug },
  })
  const article = data.articles[0]
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

export default Page
