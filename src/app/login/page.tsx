'use client'
import { signIn } from 'next-auth/react'

const Page = () => <button onClick={() => signIn('github', {callbackUrl: '/articles'})}>Sign in</button>

export default Page
