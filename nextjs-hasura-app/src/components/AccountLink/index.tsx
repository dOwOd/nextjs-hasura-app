import { FC } from 'react'
import Image from 'next/image'
import style from 'src/components/AccountLink/index.module.css'

interface Props {
  href: string
  imageSrc: any
  text: string
}

export const AccountLink: FC<Props> = ({ href, imageSrc, text }) => (
  <div>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={style.iconLink}
    >
      <Image src={imageSrc} alt={text} className={style.iconImage} />
      {text}
    </a>
  </div>
)
