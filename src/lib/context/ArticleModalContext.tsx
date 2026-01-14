'use client'

import { createContext, useContext, FC, PropsWithChildren } from 'react'

const ArticleModalContext = createContext<boolean>(false)

export const ArticleModalProvider: FC<PropsWithChildren> = ({ children }) => (
  <ArticleModalContext.Provider value={true}>
    {children}
  </ArticleModalContext.Provider>
)

export const useIsInArticleModal = () => useContext(ArticleModalContext)
