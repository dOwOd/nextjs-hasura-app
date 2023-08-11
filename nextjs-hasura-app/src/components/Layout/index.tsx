import { ReactNode, FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from 'src/components/Layout/index.module.css'
import { Metadata } from 'next'

interface Props {
  children: ReactNode
}

export const metadata: Metadata = {
  title: "dOwOd's logs",
}

export const Layout: FC<Props> = ({ children }) => {
  return (
    <article>
      <header>
        <nav>
          <ul>
            <li>
              <strong>
                <Link href="/">{`dOwOd's logs`}</Link>
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
  )
}
