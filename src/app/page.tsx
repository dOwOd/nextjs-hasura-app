import { TopIcon } from 'src/components/TopIcon'
import { Accounts } from 'src/components/Accounts'
import { Profile } from 'src/components/Profile'
import style from './index.module.css'
import { Metadata } from 'next'
import { initializeApollo } from 'src/lib/apolloClient'
import { GetArticlesByStatusQuery } from 'src/gql/graphql'
import { GET_ARTICLES_BY_STATUS } from 'src/queries/queries'
import Link from 'next/link'
import { dateFromat } from 'src/lib/utils/DateFormat'
import { FaPencilAlt } from 'react-icons/fa'

export const metadata: Metadata = {
  title: "dOwOd's logs",
}

const Page = async () => {
  const result = await initializeApollo().query<GetArticlesByStatusQuery>({
    query: GET_ARTICLES_BY_STATUS,
    variables: { status: 'public' },
    context: {
      fetchOptions: {
        next: { revalidate: 1 },
      },
    },
  })
  const data = result.data as GetArticlesByStatusQuery

  return (
    <div className={style.topList}>
      <TopIcon />
      <Accounts />
      <Profile />

      <h2>Blog</h2>
      <div>
        {data.articles.map((article) => (
          <article key={article.id}>
            <>
              <h3>
                <Link href={`/blog/${article.slug}`} key={article.id}>
                  {article.title}
                </Link>
              </h3>
              <cite>
                <small>
                  <FaPencilAlt /> {dateFromat(article.created_at, '-')}
                </small>
              </cite >
            </>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Page
