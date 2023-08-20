import type { NextPage } from 'next'
import { TopIcon } from 'src/components/TopIcon'
import { Accounts } from 'src/components/Accounts'
import { Profile } from 'src/components/Profile'
import style from 'src/app/index.module.css'
import { Metadata } from 'next'
import { Articles } from 'src/components/Articles'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "dOwOd's logs",
}

const Page: NextPage = () => (
  <div className={style.topList}>
    <TopIcon />
    <Profile />
    <Accounts />
    <h2>Blog</h2>

    <Link href='/blog/first-post'>test</Link>
  </div>
)

export default Page
