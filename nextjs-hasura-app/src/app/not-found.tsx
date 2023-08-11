import { Layout } from 'src/components/Layout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Not Found',
}

const NotFound = () => (
  <div>
    <Layout>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </Layout>
  </div>
)

export default NotFound
