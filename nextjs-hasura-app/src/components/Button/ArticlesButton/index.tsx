'use client'

import Link from 'next/link'
import style from 'src/components/Button/ArticlesButton/index.module.css'
import { useSession } from 'next-auth/react'

export const ArticlesButton = () => {
  const session = useSession()
  if (session.status === 'unauthenticated') return null

  return (
    <div className={style.articlesButton}>
      <Link href="/articles" className="secondary" role="button">
        Articles
      </Link>
    </div>
  )
}
