import { Layout } from 'src/components/Layout'
import { initializeApollo } from 'src/lib/apolloClient'
import { GetArticlesByStatusQuery } from 'src/gql/graphql'
import { GET_ARTICLES_BY_STATUS } from 'src/queries/queries'
import { BreadCrumb } from 'src/components/BreadCrumb'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
}

const Page = async () => {
  const { data } = await initializeApollo().query<GetArticlesByStatusQuery>({
    query: GET_ARTICLES_BY_STATUS,
    variables: { status: 'public' },
  })

  console.log(data);
  

  return (
    <Layout>
      <BreadCrumb />
      <div>
        {data.articles.map(({ id, slug, title }) => (
          <Link href={`/blog/${slug}`} key={id}>
            <article>Title: {title}</article>
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export default Page
