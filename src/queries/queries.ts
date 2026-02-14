import { gql } from '@apollo/client'

export const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($slug: String!) {
    articles(where: {
      slug: { _eq: $slug }
      status: { _eq: "public" }
    }) {
      id
      slug
      status
      title
      content
      updated_at
      created_at
    }
  }
`

export const GET_ARTICLES_BY_STATUS = gql`
  query GetArticlesByStatus($status: String!) {
    articles(
      where: { status: { _eq: $status } }
      order_by: { created_at: desc }
    ) {
      id
      slug
      title
      updated_at
      created_at
    }
  }
`
