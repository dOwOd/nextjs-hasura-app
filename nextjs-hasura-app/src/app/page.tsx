import type { NextPage } from 'next'
import { TopIcon } from 'src/components/TopIcon'
import { Accounts } from 'src/components/Accounts'
import { Profile } from 'src/components/Profile'
import style from 'src/app/index.module.css'
import { Metadata } from 'next'
import { Articles } from 'src/components/Articles'

export const metadata: Metadata = {
  title: "dOwOd's logs",
}

const Page: NextPage = () => {

  return (
    <div className={style.topList}>
      <TopIcon />
      <Profile />
      <Accounts />
      <h2>Blog</h2>
      {/* @ts-expect-error Server Component */}
      <Articles />
    </div>
  )
}
export default Page
