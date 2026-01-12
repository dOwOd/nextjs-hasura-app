import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { isVerifyEmailAddress } from 'src/lib/utils/isVerifyEmailAddress'

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async signIn({ user }) {
      return isVerifyEmailAddress(user.email)
    },
  },
})
