import type { NextPage } from 'next'
import { Layout } from 'src/components/Layout'
import { TopIcon } from 'src/components/TopIcon'
import { Accounts } from 'src/components/Accounts'
import { Profile } from 'src/components/Profile'
import style from 'src/pages/index.module.css'

const Home: NextPage = () => {
  return (
    <Layout title={`dOwOd\'s logs`}>
      <div className={style.topList}>
        <TopIcon />
        <Profile />
        <Accounts />
      </div>
    </Layout>
  )
}

export default Home
