import type { NextPage } from 'next'
import { TopIcon } from 'src/components/TopIcon'
import { Accounts } from 'src/components/Accounts'
import { Profile } from 'src/components/Profile'
import style from 'src/app/index.module.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "dOwOd's logs",
}

const Page: NextPage = () => (
  <div className={style.topList}>
    <TopIcon />
    <Profile />
    <Accounts />
  </div>
)

export default Page
