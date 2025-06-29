import '@picocss/pico'
import { Analytics } from '@vercel/analytics/react'
import { Layout } from 'src/components/Layout'
import { Session } from 'src/components/Providers/Session'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Session>
          <Layout>
            {children}
            <Analytics />
          </Layout>
        </Session>
      </body>
    </html>
  )
}
