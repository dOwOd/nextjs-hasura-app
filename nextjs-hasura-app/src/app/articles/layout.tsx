'use client'

import { ApolloProvider } from '@apollo/client'
import { initializeApollo } from 'src/lib/apolloClient'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const client = initializeApollo()
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
