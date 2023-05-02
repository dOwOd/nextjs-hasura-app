import { ReactNode, FC } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  children: ReactNode
  title: string
}
export const Layout: FC<Props> = ({
  children,
  title = 'Welcome to Nextjs',
}) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <header>
        <nav>
          <div>
            <div className="flex space-x-4">
              <Link href="/">
                Home
              </Link>
              <Link href="/articles">
                記事一覧
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          {/* <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" /> */}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  )
}
