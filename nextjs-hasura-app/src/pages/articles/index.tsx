import { FC } from 'react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { initializeApollo } from 'lib/apolloClient'
import { GetArticlesQuery, Articles } from 'src/gql/graphql'
import { GET_ARTICLES } from 'src/queries/queries'
import { dateFromat } from 'lib/utils/DateFormat'
import { Layout } from 'src/components/Layout'
import { Button } from 'src/components/Button'
import style from 'src/pages/articles/index.module.css'

export const getServerSideProps: GetServerSideProps = async () => {
  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<GetArticlesQuery>({
    query: GET_ARTICLES,
  })
  return {
    props: {
      articles: data.articles,
    },
  }
}

interface Props {
  articles: {
    __typename?: 'articles'
  } & Pick<
    Articles,
    'id' | 'slug' | 'title' | 'status' | 'created_at' | 'updated_at'
  >[]
}
const Article: FC<Props> = ({ articles }) => (
  <Layout title="Articles">
    <table>
      <thead>
        <tr>
          <th scope="col">slug</th>
          <th scope="col">title</th>
          <th scope="col">status</th>
          <th scope="col">updated_at</th>
          <th scope="col">created_at</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {articles.map(({ id, slug, title, status, updated_at, created_at }) => (
          <tr key={id}>
            <td>{slug}</td>
            <td>
              <Link href={`/blog/${slug}`}>{title}</Link>
            </td>
            <td>{status}</td>
            <td>{dateFromat(updated_at, 'YYYY-MM-DD hh:mm:ss')}</td>
            <td>{dateFromat(created_at, 'YYYY-MM-DD hh:mm:ss')}</td>
            <td>
              <div className={style.buttonWrap}>
                <Button href='/' text='編集' className='outline'/>
                <Button href='/' text='削除' className='secondary outline' />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Layout>
)

export default Article
