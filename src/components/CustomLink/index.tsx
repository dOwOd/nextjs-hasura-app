import { FC, ReactNode, AnchorHTMLAttributes } from 'react'

export const CustomLink: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({ href, children }) => (
  <a href={href} rel="noreferrer" target="_blank">
    {children}
  </a>
)
