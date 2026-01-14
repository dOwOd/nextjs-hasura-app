'use client'

import { FC, useEffect, useRef, useCallback, MouseEventHandler, useState } from 'react'
import Image from 'next/image'
import { useImageModal } from 'src/lib/context/ImageModalContext'
import styles from './index.module.css'

export const ImageModal: FC = () => {
  const { state, closeImageModal } = useImageModal()
  const overlayRef = useRef<HTMLDialogElement>(null)
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)

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

  // 画像読み込み時にサイズを計算
  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const naturalWidth = img.naturalWidth
    const naturalHeight = img.naturalHeight

    // 画面の最大サイズ（90vw x 85vh、余白を考慮）
    const maxWidth = window.innerWidth * 0.9
    const maxHeight = window.innerHeight * 0.85

    // アスペクト比を保って最大サイズに収める
    const ratio = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight)

    setImageSize({
      width: naturalWidth * ratio,
      height: naturalHeight * ratio,
    })
  }, [])

  // 画像が変わった時にサイズをリセット
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageSize(null)
  }, [state.src])

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
          width={imageSize?.width || 100}
          height={imageSize?.height || 100}
          onLoad={handleImageLoad}
          onClick={handleImageClick}
          className={styles.image}
          style={{
            objectFit: 'contain',
            visibility: imageSize ? 'visible' : 'hidden',
          }}
        />
      </div>
    </dialog>
  )
}
