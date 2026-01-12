'use client'

import { FC } from "react"
import { useCloseModal } from "src/lib/hooks/useCloseModal"

export const CloseModalButton: FC = () => {
  const { onClick, overlay } = useCloseModal()

  return (
    <a
      className="close"
      aria-label="Close"
      onClick={onClick}
      ref={overlay}
    />
  )
}

