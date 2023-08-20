import { Articles as ArticleType } from 'src/gql/graphql'
import { dateFromat } from 'src/lib/utils/DateFormat'
import { FC } from 'react'
import { markdownToReactElement } from 'src/lib/utils/markdownToReactElement'

type Props = {
  article: ArticleType
}

export const Article: FC<Props> = ({ article }) => {
  const content = markdownToReactElement(article.content)
  return (
    <article>
      <hgroup>
        <h1>{article.title}</h1>
        <h6>created_at: {dateFromat(article.created_at)}</h6>
      </hgroup>
      <div>{content}</div>
    </article>
  )
}