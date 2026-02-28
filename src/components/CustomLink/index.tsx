import { FC, AnchorHTMLAttributes } from 'react'
import Link from 'next/link'

const isExternalUrl = (href: string): boolean =>
  href.startsWith('http://') || href.startsWith('https://')

export const CustomLink: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({ href, children }) => {
  if (href && !isExternalUrl(href)) {
    return <Link href={href}>{children}</Link>
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
