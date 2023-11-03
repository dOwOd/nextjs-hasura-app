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

export const GET_ARTICLE_BY_ID = gql`
  query GetArticleById($id: uuid!) {
    articles_by_pk(id: $id) {
      id
      created_at
      content
      slug
      status
      title
      updated_at
    }
  }
`

export const GET_ARTICLES_BY_STATUS = gql`
  query GetArticlesByStatus($status: String!) {
    articles(where: { status: { _eq: $status } }) {
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

export const CREATE_ARTICLE = gql`
  mutation CreateArticle(
    $slug: String!
    $title: String!
    $content: String
    $status: String!
  ) {
    insert_articles_one(
      object: { slug: $slug, title: $title, content: $content, status: $status }
    ) {
      id
    }
  }
`

export const UPDATE_ARTICLE = gql`
  mutation UpdateArticle(
    $id: uuid!
    $slug: String!
    $title: String!
    $content: String
    $status: String!
  ) {
    update_articles_by_pk(
      pk_columns: { id: $id }
      _set: { slug: $slug, title: $title, content: $content, status: $status }
    ) {
      id
    }
  }
`

export const DELETE_ARTICLE_BY_ID = gql`
  mutation DeleteArticleById($id: uuid!) {
    delete_articles_by_pk(id: $id) {
      id
      slug
      title
    }
  }
`
