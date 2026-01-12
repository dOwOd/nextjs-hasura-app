import { Articles as ArticleType } from 'src/gql/graphql'
import { dateFromat } from 'src/lib/utils/DateFormat'
import { FC } from 'react'
import { markdownToReactElement } from 'src/lib/utils/markdownToReactElement'
import { CloseModalButton } from '../CloseModalButton'
import styles from './index.module.css'

type Props = {
  article: ArticleType
}

export const Article: FC<Props> = ({ article }) => {
  const content = markdownToReactElement(article.content)

  return (
    <article className={styles.article}>
      <header>
        <CloseModalButton />
        <h1>{article.title}</h1>
        <h6>{dateFromat(article.created_at, '-')}</h6>
      </header>
      <div>
        {content}
      </div>
    </article>
  )
}