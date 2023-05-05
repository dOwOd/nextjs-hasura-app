import Link from 'next/link'
import { FC } from 'react'
import styles from 'src/components/Button/index.module.css'

interface Props {
  href: string
  text: string
  className: 'outline' | 'secondary outline' | 'contrast outline'
}

export const Button: FC<Props> = ({ href, text, className }) => (
  <div className={styles.button}>
    <Link href={href} className={className} role="button">
      {text}
    </Link>
  </div>
)
