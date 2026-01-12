import { ApolloClient } from '@apollo/client/core'
import { HttpLink } from '@apollo/client/link/http'
import { InMemoryCache } from '@apollo/client/cache'
import 'cross-fetch/polyfill'

let apolloClient: ApolloClient | undefined
const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_URL,
      headers: {
        'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_KEY || '',
      },
    }),
    cache: new InMemoryCache(),
  })
}
export const initializeApollo = (initialState = null) => {
  const _apolloClient = apolloClient ?? createApolloClient()
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}