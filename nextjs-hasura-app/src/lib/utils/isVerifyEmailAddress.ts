export const isVerifyEmailAddress = (emailAddress: string | null | undefined) =>
  emailAddress === process.env.NEXT_PUBLIC_EMAIL_ADDRESS
