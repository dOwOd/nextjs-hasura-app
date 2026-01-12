'use client'

import { useEffect } from 'react'

type Props = {
  title: string
}

export const PageTitle = ({ title }: Props) => {
  useEffect(() => {
    document.title = `${title} | dOwOd's logs`
  }, [title])

  return null
}
