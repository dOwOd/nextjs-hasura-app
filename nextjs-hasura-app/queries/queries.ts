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