'use client'

import { GetArticlesQuery } from 'src/gql/graphql'
import { GET_ARTICLES } from 'src/queries/queries'
import { Layout } from 'src/components/Layout'
import { useQuery } from '@apollo/client'
import { Articles } from 'src/components/Articles'

const Page = () => {
  const { data, loading } = useQuery<GetArticlesQuery>(GET_ARTICLES)

  if (loading) return <Layout>Loading...</Layout>

  return (
    <Layout>
      <Articles articles={data?.articles} />
    </Layout>
  )
}

export default Page
