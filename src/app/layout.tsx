import '@picocss/pico'
import { Metadata } from 'next'
import { GoogleAnalytics } from 'src/components/GoogleAnalytics'
import { Layout } from 'src/components/Layout'
import { ImageModalProvider } from 'src/lib/context/ImageModalContext'
import { ImageModal } from 'src/components/ImageModal'

export const metadata: Metadata = {
  title: {
    default: "dOwOd's logs",
    template: "%s | dOwOd's logs",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <ImageModalProvider>
          <Layout>
            {children}
          </Layout>
          <ImageModal />
        </ImageModalProvider>
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID} />
        )}
      </body>
    </html>
  )
}
