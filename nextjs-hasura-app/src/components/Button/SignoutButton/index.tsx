'use client'

import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

export const SignoutButton = () => {
  const session = useSession()
  if (session.status === 'unauthenticated') return null

  return (
    <button onClick={() => signOut({ callbackUrl: '/login' })}>Sign out</button>
  )
}
