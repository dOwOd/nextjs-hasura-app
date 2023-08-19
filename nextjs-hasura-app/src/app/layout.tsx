import '@picocss/pico'
import { Analytics } from '@vercel/analytics/react'
import { Layout } from 'src/components/Layout'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Layout>
          {children}
          <Analytics />
        </Layout>
      </body>
    </html>
  )
}
