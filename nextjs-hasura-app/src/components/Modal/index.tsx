// https://github.com/vercel-labs/nextgram/blob/main/src/components/modal/Modal.tsx
'use client'

import { FC } from 'react'
import style from './index.module.css'
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
      className={style.dialog}
    >
      <div>
        {children}
      </div>
    </dialog>

  )
}