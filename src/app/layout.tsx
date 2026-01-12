import '@picocss/pico'
import { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from 'src/components/GoogleAnalytics'
import { Layout } from 'src/components/Layout'
import { Session } from 'src/components/Providers/Session'

export const metadata: Metadata = {
  title: {
    default: "dOwOd's logs",
    template: "%s | dOwOd's logs",
  },
}

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Session>
          <Layout>
            {children}
            {modal}
            <Analytics />
          </Layout>
        </Session>
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID} />
        )}
      </body>
    </html>
  )
}
