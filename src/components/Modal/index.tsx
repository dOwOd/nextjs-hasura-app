// https://github.com/vercel-labs/nextgram/blob/main/src/components/modal/Modal.tsx
'use client'

import { FC, useEffect } from 'react'
import { useCloseModal } from 'src/lib/hooks/useCloseModal'
import styles from './index.module.css'

interface Props {
  children: React.ReactNode
}

export const Modal: FC<Props> = ({ children }) => {
  const { onClick, overlay, onDismiss } = useCloseModal()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <dialog
      open
      ref={overlay}
      onClick={onClick}
      className={styles.dialog}
    >
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.mobileCloseButton}
          onClick={onDismiss}
          aria-label="閉じる"
        >
          ✕
        </button>
        {children}
      </div>
    </dialog>
  )
}