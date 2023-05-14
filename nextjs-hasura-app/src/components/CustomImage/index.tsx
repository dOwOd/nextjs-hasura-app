import { FC, ImgHTMLAttributes } from 'react'
import Image from 'next/image'

export const CustomImage: FC<ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  alt,
  width,
  height,
}) => {
  if (src === undefined) return null

  return width && alt ? (
    <Image src={src} alt={alt} width={Number(width)} height={Number(height)} />
  ) : (
    <img src={src} alt={alt} />
  )
}
