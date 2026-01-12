'use client'

import Link from 'next/link'
import style from 'src/components/Button/ArticlesButton/index.module.css'
import { useSession } from 'next-auth/react'
import { isVerifyEmailAddress } from 'src/lib/utils/isVerifyEmailAddress'

export const ArticlesButton = () => {
  const session = useSession()
  if (isVerifyEmailAddress(session.data?.user?.email))
    return (
      <div className={style.articlesButton}>
        <Link href="/articles" className="secondary" role="button">
          Articles
        </Link>
      </div>
    )
  return <></>
}
