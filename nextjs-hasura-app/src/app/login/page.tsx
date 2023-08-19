'use client'

import { Layout } from 'src/components/Layout'
import { useSession, signIn } from 'next-auth/react'
import { isVerifyEmailAddress } from 'src/lib/utils/isVerifyEmailAddress'
import { SeeYou } from 'src/components/SeeYou'

const Page = () => {
  const { data: session } = useSession()

  if (session == undefined)
    return (
      <Layout>
        <button onClick={() => signIn('github')}>Sign in</button>
      </Layout>
    )

  const detail = isVerifyEmailAddress(session.user?.email) ? (
    (window.location.href = '/articles')
  ) : (
    <SeeYou />
  )

  return <Layout>{detail}</Layout>
}

export default Page
