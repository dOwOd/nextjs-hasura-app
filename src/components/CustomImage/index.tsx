'use client'

import { FC, ImgHTMLAttributes } from 'react'
import Image from 'next/image'
import { useImageModal } from 'src/lib/context/ImageModalContext'
import styles from './index.module.css'

export const CustomImage: FC<ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  alt,
  width,
  height,
}) => {
  const { openImageModal } = useImageModal()

  if (src === undefined) return null

  const handleClick = () => {
    openImageModal(src, alt || '')
  }

  const imageProps = width && alt
    ? { width: Number(width), height: Number(height) }
    : { width: 400, height: 400 }

  return (
    <Image
      src={src}
      alt={alt || ''}
      {...imageProps}
      className={styles.customImage}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    />
  )
}
