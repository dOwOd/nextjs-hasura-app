'use client'

import { createContext, useContext, useState, useCallback, FC, PropsWithChildren } from 'react'

type ImageModalState = {
  isOpen: boolean
  src: string | null
  alt: string | null
}

type ImageModalContextType = {
  state: ImageModalState
  openImageModal: (src: string, alt: string) => void
  closeImageModal: () => void
}

const ImageModalContext = createContext<ImageModalContextType | null>(null)

export const ImageModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<ImageModalState>({
    isOpen: false,
    src: null,
    alt: null,
  })

  const openImageModal = useCallback((src: string, alt: string) => {
    setState({ isOpen: true, src, alt })
  }, [])

  const closeImageModal = useCallback(() => {
    setState({ isOpen: false, src: null, alt: null })
  }, [])

  return (
    <ImageModalContext.Provider value={{ state, openImageModal, closeImageModal }}>
      {children}
    </ImageModalContext.Provider>
  )
}

export const useImageModal = () => {
  const context = useContext(ImageModalContext)
  if (!context) {
    throw new Error('useImageModal must be used within ImageModalProvider')
  }
  return context
}
