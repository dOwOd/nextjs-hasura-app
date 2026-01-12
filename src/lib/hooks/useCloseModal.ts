'use client'
import { useRef, useCallback,useEffect, MouseEventHandler } from "react"
import { useRouter } from 'next/navigation'

export const useCloseModal = () => {
  const overlay = useRef(null)
  const router = useRouter()

  const onDismiss = useCallback(() => {
    router.back()
  }, [router])

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (e.target === overlay.current) {
        if (onDismiss) onDismiss()
      }
    },
    [onDismiss, overlay]
  )

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    },
    [onDismiss]
  )

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  return { onClick, overlay }
}