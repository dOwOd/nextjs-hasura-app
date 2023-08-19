'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { isVerifyEmailAddress } from 'src/lib/utils/isVerifyEmailAddress'

export const SignoutButton = () => {
  const session = useSession()
  if (isVerifyEmailAddress(session.data?.user?.email))
    return (
      <Link
        href="#"
        role="button"
        onClick={() => signOut({ callbackUrl: '/login' })}
      >
        Sign out
      </Link>
    )

  return <></>
}
