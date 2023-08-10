import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { initializeApollo } from 'src/lib/apolloClient'
import { SessionProvider } from 'next-auth/react'
import '@picocss/pico'
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const client = initializeApollo()
  return (
    <SessionProvider>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
        <Analytics />
      </ApolloProvider>
    </SessionProvider>
  )
}

export default MyApp
