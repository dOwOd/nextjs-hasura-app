'use client'

import { useState, FormEvent, use } from 'react';
import { GetArticleByIdQuery, UpdateArticleMutation } from 'src/gql/graphql'
import { GET_ARTICLE_BY_ID, UPDATE_ARTICLE } from 'src/queries/queries'
import { useMutation } from '@apollo/client'
import { useSuspenseQuery } from '@apollo/client'

type Props = {
  params: Promise<{
    id: string
  }>
}

const status = ['draft', 'public']
const Page = (props: Props) => {
  const params = use(props.params);
  const { data } = useSuspenseQuery<GetArticleByIdQuery>(GET_ARTICLE_BY_ID, {
    variables: { id: params.id },
  })
  const article = data.articles_by_pk
  const [editedArticle, setEditedArticle] = useState(article)

  const [update_users_by_pk] =
    useMutation<UpdateArticleMutation>(UPDATE_ARTICLE)
  const updateArticle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await update_users_by_pk({
      variables: {
        id: editedArticle?.id,
        slug: editedArticle?.slug,
        title: editedArticle?.title,
        content: editedArticle?.content,
        status: editedArticle?.status,
      },
    })
  }

  if (!editedArticle) {
    return 'error...'
  }

  return (
    <form onSubmit={updateArticle}>
      <label htmlFor="articleSlug">
        article slug
        <input
          type="text"
          id="slug"
          name="slug"
          value={editedArticle.slug}
          onChange={({ target }) =>
            setEditedArticle({ ...editedArticle, slug: target.value })
          }
          required
        />
      </label>
      <label htmlFor="articleTitle">
        article title
        <input
          type="text"
          id="title"
          name="title"
          value={editedArticle.title}
          onChange={({ target }) =>
            setEditedArticle({ ...editedArticle, title: target.value })
          }
          required
        />
      </label>
      <label htmlFor="articleContent">
        article content
        <textarea
          name="content"
          rows={10}
          value={editedArticle.content}
          onChange={({ target }) =>
            setEditedArticle({ ...editedArticle, content: target.value })
          }
        />
      </label>
      <label htmlFor="status">article status</label>
      <select
        id="status"
        onChange={({ target }) =>
          setEditedArticle({ ...editedArticle, status: target.value })
        }
        required
      >
        <option value={article?.status}>
          {article?.status === 'draft' ? '下書き' : '公開'}
        </option>
        {status.map((item) =>
          item === article?.status ? null : (
            <option value={item} key={item}>
              {item === 'draft' ? '下書き' : '公開'}
            </option>
          )
        )}
      </select>
      <button type="submit">更新</button>
    </form>
  )
}

export default Page
