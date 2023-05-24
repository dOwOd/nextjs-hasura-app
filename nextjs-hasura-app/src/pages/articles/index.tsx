import { FC } from 'react'
import { GetArticlesQuery } from 'src/gql/graphql'
import { GET_ARTICLES } from 'src/queries/queries'
import { Layout } from 'src/components/Layout'
import { useQuery } from '@apollo/client'
import { useSession, signIn } from 'next-auth/react'
import { Articles } from 'src/components/Articles'
import { isVerifyEmailAddress } from 'src/lib/utils/isVerifyEmailAddress'
import styles from 'src/pages/articles/index.module.css'

const Index: FC = () => {
  const { data, loading } = useQuery<GetArticlesQuery>(GET_ARTICLES)
  const { data: session } = useSession()

  if (loading) return <Layout title="Articles">Loading...</Layout>

  if (session == undefined)
    return (
      <Layout title="Articles">
        <button onClick={() => signIn()}>Sign in</button>
      </Layout>
    )

  const detail = isVerifyEmailAddress(session.user?.email) && data?.articles ? (
    <Articles articles={data.articles} />
  ) : (
    <>
      <p className={styles.text}>hello &#x1F44B;</p>
    </>
  )

  return <Layout title="Articles">{detail}</Layout>
}

export default Index
