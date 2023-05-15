import { FC } from 'react'
import Link from 'next/link'
import {
  GetArticlesQuery,
  DeleteArticleByIdMutation,
  Articles,
} from 'src/gql/graphql'
import { GET_ARTICLES, DELETE_ARTICLE_BY_ID } from 'src/queries/queries'
import { dateFromat } from 'src/lib/utils/DateFormat'
import { Layout } from 'src/components/Layout'
import style from 'src/pages/articles/index.module.css'
import { useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'

interface Props {
  articles: {
    __typename?: 'articles'
  } & Pick<
    Articles,
    'id' | 'slug' | 'title' | 'status' | 'created_at' | 'updated_at'
  >[]
}
const Article: FC<Props> = () => {
  const { data, loading } = useQuery<GetArticlesQuery>(GET_ARTICLES)
  const [delete_articles_by_pk] =
    useMutation<DeleteArticleByIdMutation>(DELETE_ARTICLE_BY_ID)
  const router = useRouter()

  if (loading) <Layout title="Articles">Loading...</Layout>

  return (
    <Layout title="Articles">
      <div className={style.newButton}>
        <Link href={`/articles/new`} className="contrast" role="button">
          New
        </Link>
      </div>
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
          {data?.articles.map(
            ({ id, slug, title, status, updated_at, created_at }) => (
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
                    <Link
                      href={`/articles/${id}`}
                      className="primary"
                      role="button"
                    >
                      Edit
                    </Link>
                    <Link
                      href="#"
                      className="secondary outline"
                      role="button"
                      onClick={() => {
                        delete_articles_by_pk({ variables: { id: id } })
                        router.refresh()
                      }}
                    >
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </Layout>
  )
}

export default Article
