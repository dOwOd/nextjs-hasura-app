import { ReactNode, FC } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import style from 'src/components/Layout/index.module.css'

interface Props {
  children: ReactNode
  title: string
}
export const Layout: FC<Props> = ({ children, title = "dOwOd's logs" }) => {
  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
      </Head>
      <article>
        <header>
          <nav>
            <ul>
              <li>
                <strong>
                  <Link href="/">dOwOd's logs</Link>
                </strong>
              </li>
            </ul>
            <ul>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="container">{children}</main>

        <footer>
          <div className={style.footer}>
          <div className="grid">
            <small>© 2023- dowod.dev</small>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by{' '}
              {/* <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" /> */}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </a>
          </div>
          </div>
        </footer>
      </article>
    </div>
  )
}
