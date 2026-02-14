import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from 'src/components/Layout/index.module.css'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: "dOwOd's logs",
}

export const Layout: FC<PropsWithChildren> = ({ children }) => (
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
      </nav>
    </header>
    <main className="container">{children}</main>

    <footer>
      <div className={style.footer}>
        <div className="grid">
          <small>{`© ${new Date().getFullYear()} - dowod.dev`}</small>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className={style.poweredByLink}
          >
            Powered by{' '}
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </a>
        </div>
      </div>
    </footer>
  </article>
)
