import type { NextPage } from 'next'
import Link from 'next/link'
import { Layout } from 'src/components/Layout'
import { TopIcon } from 'src/components/TopIcon'
import { Accounts } from 'src/components/Accounts'

const Home: NextPage = () => {
  return (
    <Layout title={`dOwOd\'s logs`}>
      <div className="grid">
        <TopIcon />
        <Accounts />
      </div>
      <Link href="/articles">Blog</Link>
    </Layout>
  )
}

export default Home
