'use client'

import { GetArticlesQuery } from 'src/gql/graphql'
import { GET_ARTICLES } from 'src/queries/queries'
import { Layout } from 'src/components/Layout'
import { useQuery } from '@apollo/client'
import { useSession, signIn } from 'next-auth/react'
import { Articles } from 'src/components/Articles'
import { isVerifyEmailAddress } from 'src/lib/utils/isVerifyEmailAddress'
import { SeeYou } from 'src/components/SeeYou'
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

const Page = () => {
  loadErrorMessages()
  loadDevMessages()
  const { data, loading } = useQuery<GetArticlesQuery>(GET_ARTICLES)
  const { data: session } = useSession()

  if (loading) return <Layout>Loading...</Layout>

  if (session == undefined)
    return (
      <Layout>
        <button onClick={() => signIn()}>Sign in</button>
      </Layout>
    )

  const detail = isVerifyEmailAddress(session.user?.email) && data?.articles ? (
    <Articles articles={data.articles} />
  ) : (
    <SeeYou />
  )

  return <Layout>{detail}</Layout>
}

export default Page
