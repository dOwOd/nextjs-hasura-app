import Link from 'next/link'
import style from 'src/components/Articles/index.module.css'
import { Articles as ArticleType } from 'src/gql/graphql'
import { DELETE_ARTICLE_BY_ID } from 'src/queries/queries'
import { DeleteArticleByIdMutation } from 'src/gql/graphql'
import { dateFromat } from 'src/lib/utils/DateFormat'
import { useMutation } from '@apollo/client'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

interface Props {
  articles: Pick<
  ArticleType,
  'id' | 'slug' | 'title' | 'status' | 'created_at' | 'updated_at'
>[] | undefined
}

export const Articles: FC<Props> = ({ articles }) => {
  const [delete_articles_by_pk] =
    useMutation<DeleteArticleByIdMutation>(DELETE_ARTICLE_BY_ID)
  const router = useRouter()

  return (
    <>
      <div className={style.newButton}>
        <Link href={`/articles/new`} className="co  ntrast" role="button">
          New
        </Link>
        <>
          <button onClick={() => signOut({callbackUrl: '/login'})}>Sign out</button>
        </>
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
          {articles?.map(
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
    </>
  )
}
