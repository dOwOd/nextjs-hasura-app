import { Timer } from 'src/components/Timer'
import { Layout } from 'src/components/Layout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prototypes',
}

const Page = () => {
  return (
    <Layout>
      <article>
        <h1>Timer</h1>
        <Timer />
      </article>
    </Layout>
  )
}

export default Page
