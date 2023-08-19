'use client'

import { GetArticlesQuery } from 'src/gql/graphql'
import { GET_ARTICLES } from 'src/queries/queries'
import { Layout } from 'src/components/Layout'
import { useQuery } from '@apollo/client'
import { useSession, signIn } from 'next-auth/react'
import { isVerifyEmailAddress } from 'src/lib/utils/isVerifyEmailAddress'
import { SeeYou } from 'src/components/SeeYou'

const Page = () => {
  const { data, loading } = useQuery<GetArticlesQuery>(GET_ARTICLES)
  const { data: session } = useSession()

  if (loading) return <Layout>Loading...</Layout>

  if (session == undefined) {
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://www.dowo.dev/'
    console.log(baseUrl);
    
    return (
      <Layout>
        <button onClick={() => signIn('github', { callbackUrl: `${baseUrl}articles` })}>Sign in</button>
      </Layout>
    )
  }

  const detail = isVerifyEmailAddress(session.user?.email) && data?.articles ? (
    <SeeYou />
  ) : (
    <SeeYou />
  )

  return <Layout>{detail}</Layout>
}

export default Page
