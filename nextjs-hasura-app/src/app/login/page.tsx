'use client'

import { Layout } from 'src/components/Layout'
import { useSession, signIn } from 'next-auth/react'
import { isVerifyEmailAddress } from 'src/lib/utils/isVerifyEmailAddress'
import { SeeYou } from 'src/components/SeeYou'

const Page = () => {
  const { data: session } = useSession()
  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://www.dowo.dev/'

  if (session == undefined) {
    console.log(baseUrl);
    
    return (
      <Layout>
        <button onClick={() => signIn('github', { callbackUrl: `${baseUrl}articles` })}>Sign in</button>
      </Layout>
    )
  }

  console.log(session.user?.email);
  console.log(isVerifyEmailAddress(session.user?.email));

  const detail = isVerifyEmailAddress(session.user?.email) ? (
    window.location.href = `${baseUrl}articles`
  ) : (
    <SeeYou />
  )

  return <Layout>{detail}</Layout>
}

export default Page
