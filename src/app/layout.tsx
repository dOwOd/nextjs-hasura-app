import '@picocss/pico'
import { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from 'src/components/GoogleAnalytics'
import { Layout } from 'src/components/Layout'
import { Session } from 'src/components/Providers/Session'
import { ImageModalProvider } from 'src/lib/context/ImageModalContext'
import { ImageModal } from 'src/components/ImageModal'
import { ThemeProvider } from 'src/lib/context/ThemeContext'

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
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var stored = localStorage.getItem('theme');
                var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body>
        <Session>
          <ThemeProvider>
            <ImageModalProvider>
              <Layout>
                {children}
                {modal}
                <Analytics />
              </Layout>
              <ImageModal />
            </ImageModalProvider>
          </ThemeProvider>
        </Session>
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID} />
        )}
      </body>
    </html>
  )
}
