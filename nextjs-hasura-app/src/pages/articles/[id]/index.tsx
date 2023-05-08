import { FC, useState, FormEvent } from 'react'
import { GetArticleByIdQuery, UpdateArticleMutation } from 'src/gql/graphql'
import { GET_ARTICLE_BY_ID, UPDATE_ARTICLE } from 'src/queries/queries'
import { Layout } from 'src/components/Layout'
import { GetServerSideProps } from 'next'
import { initializeApollo } from 'lib/apolloClient'
import { Articles } from 'src/gql/graphql'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'

interface Props {
  article: {
    __typename?: 'articles'
  } & Pick<
    Articles,
    'id' | 'slug' | 'title' | 'status' | 'content' | 'created_at' | 'updated_at'
  >
}

const status = ['draft', 'public']

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const apolloClient = initializeApollo()

  if (params !== undefined) {
    const { data } = await apolloClient.query<GetArticleByIdQuery>({
      query: GET_ARTICLE_BY_ID,
      variables: { id: params.id },
    })
    return {
      props: {
        article: data.articles_by_pk,
      },
    }
  }

  return {
    props: { error: true },
  }
}

const ArticleDetail: FC<Props> = ({ article }) => {
  if (article === undefined) <Layout title="Articles">error...</Layout>

  const router = useRouter()
  const [editedArticle, setEditedArticle] = useState(article)
  const [update_users_by_pk] =
    useMutation<UpdateArticleMutation>(UPDATE_ARTICLE)
  const updateArticle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await update_users_by_pk({
      variables: {
        id: editedArticle.id,
        slug: editedArticle.slug,
        title: editedArticle.title,
        content: editedArticle.content,
        status: editedArticle.status,
      },
    })
  }

  return (
    <Layout title="Articles">
      <form onSubmit={updateArticle}>
        <label htmlFor="articleSlug">
          article slug
          <input
            type="text"
            id="slug"
            name="slug"
            value={editedArticle.slug}
            onChange={(e) =>
              setEditedArticle({ ...editedArticle, slug: e.target.value })
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
            onChange={(e) =>
              setEditedArticle({ ...editedArticle, title: e.target.value })
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
            onChange={(e) =>
              setEditedArticle({ ...editedArticle, content: e.target.value })
            }
          />
        </label>
        <label htmlFor="status">article status</label>
        <select
          id="status"
          onChange={(e) =>
            setEditedArticle({ ...editedArticle, status: e.target.value })
          }
          required
        >
          <option value={article.status}>{article.status === 'draft' ? '下書き' : '公開'}</option>
          {status.map((item) => {
            if (item === article.status) return
            return (
            <option value={item}>{item === 'draft' ? '下書き' : '公開'}</option>
          )})}
        </select>
        <button type="submit">更新</button>
      </form>
    </Layout>
  )
}

export default ArticleDetail
