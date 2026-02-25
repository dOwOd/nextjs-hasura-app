import '@picocss/pico'
import { Metadata } from 'next'
import { GoogleAnalytics } from 'src/components/GoogleAnalytics'
import { Layout } from 'src/components/Layout'
import { ImageModalProvider } from 'src/lib/context/ImageModalContext'
import { ImageModal } from 'src/components/ImageModal'

export const metadata: Metadata = {
  metadataBase: new URL('https://dowo.dev'),
  title: {
    default: "dOwOd's logs",
    template: "%s | dOwOd's logs",
  },
  description: 'dOwOdの技術ブログ。Web開発や日常について書いています。',
  openGraph: {
    siteName: "dOwOd's logs",
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary',
  },
  alternates: {
    types: {
      'application/atom+xml': '/feed.xml',
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-7977717471835086',
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
