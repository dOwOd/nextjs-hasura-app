// https://github.com/vercel-labs/nextgram/blob/main/src/components/modal/Modal.tsx
'use client'

import { FC } from 'react'
import { useCloseModal } from 'src/lib/hooks/useCloseModal'

interface Props {
  children: React.ReactNode
}

export const Modal: FC<Props> = ({ children }) => {
  const { onClick, overlay } = useCloseModal()

  return (
    <dialog
      open
      ref={overlay}
      onClick={onClick}
    >
      <div>
        {children}
      </div>
    </dialog>

  )
}