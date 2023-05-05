import { gql } from '@apollo/client'

export const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($slug: String!) {
    articles(where: {slug: {_eq: $slug}}) {
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
    articles(where: {status: {_eq: $status}}) {
      id
      slug
      title
      updated_at
      created_at
    }
  }
`

export const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      id
      slug
      title
      status
      updated_at
      created_at
    }
  }
`