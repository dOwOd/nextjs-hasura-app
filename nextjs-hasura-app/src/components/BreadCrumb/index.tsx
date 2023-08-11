'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export const BreadCrumb = () => {
  const pathname = usePathname()
  const fullPath = `${pathname}`.split('/')
  return (
    <nav aria-label='breadcrumb'>
      <ul>
        {fullPath.map((path, i) => {
          const children =
            fullPath.length === i + 1 ? (
              path
            ) : (
              <Link href={ `/${path}` || '/'}>{path || 'Home'}</Link>
            )
          return <li key={path}>{children}</li>
        })}
      </ul>
    </nav>
  )
}