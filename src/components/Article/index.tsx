import { Articles as ArticleType } from 'src/gql/graphql'
import { dateFromat } from 'src/lib/utils/DateFormat'
import { FC } from 'react'
import { markdownToReactElement } from 'src/lib/utils/markdownToReactElement'
import styles from './index.module.css'

type Props = {
  article: ArticleType
}

export const Article: FC<Props> = ({ article }) => {
  const content = markdownToReactElement(article.content)

  return (
    <article className={styles.article}>
      <header>
        <h1>{article.title}</h1>
        <time dateTime={article.created_at}>{dateFromat(article.created_at, '-')}</time>
      </header>
      <div>
        {content}
      </div>
    </article>
  )
}