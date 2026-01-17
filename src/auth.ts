import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

const VERIFY_EMAIL = process.env.NEXT_PUBLIC_EMAIL_ADDRESS || ''

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return user.email === VERIFY_EMAIL
    },
  },
})
