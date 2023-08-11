import type { NextPage } from 'next'
import { Layout } from 'src/components/Layout'
import { TopIcon } from 'src/components/TopIcon'
import { Accounts } from 'src/components/Accounts'
import { Profile } from 'src/components/Profile'
import style from 'src/pages/index.module.css'

const Page: NextPage = () => {
  return (
    <Layout>
      <div className={style.topList}>
        <TopIcon />
        <Profile />
        <Accounts />
      </div>
    </Layout>
  )
}

export default Page
