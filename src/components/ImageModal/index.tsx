'use client'

import { FC, useEffect, useRef, useCallback, MouseEventHandler } from 'react'
import Image from 'next/image'
import { useImageModal } from 'src/lib/context/ImageModalContext'
import styles from './index.module.css'

export const ImageModal: FC = () => {
  const { state, closeImageModal } = useImageModal()
  const overlayRef = useRef<HTMLDialogElement>(null)

  // Escapeキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isOpen) {
        closeImageModal()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeImageModal, state.isOpen])

  // モーダル表示時にスクロールを無効化
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [state.isOpen])

  // オーバーレイクリックで閉じる（画像以外）
  const handleOverlayClick: MouseEventHandler = useCallback(() => {
    closeImageModal()
  }, [closeImageModal])

  // 画像クリック時は閉じないようにイベント伝播を止める
  const handleImageClick: MouseEventHandler = useCallback((e) => {
    e.stopPropagation()
  }, [])

  if (!state.isOpen || !state.src) return null

  return (
    <dialog
      open
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={styles.dialog}
    >
      <div className={styles.content} onClick={handleOverlayClick}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={closeImageModal}
          aria-label="閉じる"
        >
          ✕
        </button>
        <Image
          src={state.src}
          alt={state.alt || ''}
          fill
          style={{ objectFit: 'contain' }}
          className={styles.image}
          onClick={handleImageClick}
        />
      </div>
    </dialog>
  )
}
