import { FC, PropsWithChildren } from 'react'
import Link from 'next/link'
import style from 'src/components/Layout/index.module.css'

export const Layout: FC<PropsWithChildren> = ({ children }) => (
  <div className={style.wrapper}>
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
    <main className={`container ${style.main}`}>{children}</main>

    <footer>
      <div className={style.footer}>
        <small>{`© ${new Date().getFullYear()} - dowod.dev`}</small>
      </div>
    </footer>
  </div>
)
