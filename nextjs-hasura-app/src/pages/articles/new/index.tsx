import { FC, useState, FormEvent } from 'react'
import { CreateArticleMutation } from 'src/gql/graphql'
import { CREATE_ARTICLE } from 'src/queries/queries'
import { Layout } from 'src/components/Layout'
import { Articles } from 'src/gql/graphql'
import { useMutation } from '@apollo/client'

interface Props {
  article: {
    __typename?: 'articles'
  } & Pick<
    Articles,
    'id' | 'slug' | 'title' | 'status' | 'content' | 'created_at' | 'updated_at'
  >
}

const New: FC<Props> = () => {
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('')
  const [insert_articles_one] =
    useMutation<CreateArticleMutation>(CREATE_ARTICLE)

  const intertArticle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await insert_articles_one({
      variables: {
        slug: slug,
        title: title,
        content: content,
        status: status,
      },
    })
  }

  return (
    <Layout title="Articles">
      <form onSubmit={intertArticle}>
        <label htmlFor="articleSlug">
          article slug
          <input
            type="text"
            id="slug"
            name="slug"
            value={slug}
            onChange={({ target }) => setSlug(target.value)}
            required
          />
        </label>
        <label htmlFor="articleTitle">
          article title
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            required
          />
        </label>
        <label htmlFor="articleContent">
          article content
          <textarea
            name="content"
            rows={10}
            value={content}
            onChange={({ target }) => setContent(target.value)}
          />
        </label>
        <label htmlFor="status">article status</label>
        <select
          id="status"
          onChange={({ target }) => setStatus(target.value)}
          required
        >
          {['public', 'draft'].map((item) => (
            <option value={item}>{item === 'draft' ? '下書き' : '公開'}</option>
          ))}
        </select>
        <button type="submit">新規作成</button>
      </form>
    </Layout>
  )
}

export default New
