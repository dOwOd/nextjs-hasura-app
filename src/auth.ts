import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"

const VERIFY_EMAIL = process.env.NEXT_PUBLIC_EMAIL_ADDRESS || ''

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return user.email === VERIFY_EMAIL
    },
  },
})

export { handler as GET, handler as POST }
