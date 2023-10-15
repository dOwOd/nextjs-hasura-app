import { Analytics } from '@vercel/analytics/react'
import { Layout } from 'src/components/Layout'
import { Session } from 'src/components/Providers/Session'

export default function RootLayout({
  children,
  modal
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
      </body>
    </html>
  )
}
