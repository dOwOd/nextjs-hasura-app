import { FC, ImgHTMLAttributes } from 'react'
import Image from 'next/image'
import styles from './index.module.css'

export const CustomImage: FC<ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  alt,
  width,
  height,
}) => {
  if (src === undefined) return null

  return width && alt ? (
    <Image
      src={src}
      alt={alt}
      width={Number(width)}
      height={Number(height)}
      className={styles.customImage}
    />
  ) : (
    <Image
      src={src}
      alt={alt || ''}
      width={400}
      height={400}
      className={styles.customImage}
    />
  )
}
