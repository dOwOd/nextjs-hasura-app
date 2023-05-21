import { FC } from 'react'
import { GetServerSideProps } from 'next'
import { Timer } from 'src/components/Timer'
import { Layout } from 'src/components/Layout'

export const getServerSideProps: GetServerSideProps = async () => {

  return {
    props: { error: true },
  }
}

const ArticleDetail: FC = () => {
  return (
    <Layout title='Prototypes'>
      <article>
        <h1>Timer</h1>
        <Timer />
      </article>
    </Layout>
  )
}

export default ArticleDetail
