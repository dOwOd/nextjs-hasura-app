'use client'

import { SessionProvider } from "next-auth/react"
import { ApolloProvider } from "@apollo/client"
import { initializeApollo } from "src/lib/apolloClient"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const client = initializeApollo()
  return (
    <SessionProvider>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </SessionProvider>
  )
}
