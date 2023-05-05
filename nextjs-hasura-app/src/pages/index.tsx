import type { NextPage } from 'next'
import Link from 'next/link'
import { Layout } from 'src/components/Layout'
import { TopIcon } from 'src/components/TopIcon'
import { Accounts } from 'src/components/Accounts'
import { Profile } from 'src/components/Profile'

const Home: NextPage = () => {
  return (
    <Layout title={`dOwOd\'s logs`}>
      <div className="grid">
        <TopIcon />
        <Profile />
      </div>
      <div className="grid">
        <Accounts />
      </div>
    </Layout>
  )
}

export default Home
