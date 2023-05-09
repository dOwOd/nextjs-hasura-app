/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetArticleBySlug($slug: String!) {\n    articles(where: { slug: { _eq: $slug } }) {\n      id\n      slug\n      status\n      title\n      content\n      updated_at\n      created_at\n    }\n  }\n": types.GetArticleBySlugDocument,
    "\n  query GetArticleById($id: uuid!) {\n    articles_by_pk(id: $id) {\n      id\n      created_at\n      content\n      slug\n      status\n      title\n      updated_at\n    }\n  }\n": types.GetArticleByIdDocument,
    "\n  query GetArticlesByStatus($status: String!) {\n    articles(where: { status: { _eq: $status } }) {\n      id\n      slug\n      title\n      updated_at\n      created_at\n    }\n  }\n": types.GetArticlesByStatusDocument,
    "\n  query GetArticles {\n    articles {\n      id\n      slug\n      title\n      status\n      updated_at\n      created_at\n    }\n  }\n": types.GetArticlesDocument,
    "\n  mutation CreateArticle(\n    $slug: String!\n    $title: String!\n    $content: String\n    $status: String!\n  ) {\n    insert_articles_one(\n      object: { slug: $slug, title: $title, content: $content, status: $status }\n    ) {\n      id\n    }\n  }\n": types.CreateArticleDocument,
    "\n  mutation UpdateArticle(\n    $id: uuid!\n    $slug: String!\n    $title: String!\n    $content: String\n    $status: String!\n  ) {\n    update_articles_by_pk(\n      pk_columns: { id: $id }\n      _set: { slug: $slug, title: $title, content: $content, status: $status }\n    ) {\n      id\n    }\n  }\n": types.UpdateArticleDocument,
    "\n  mutation DeleteArticleById($id: uuid!) {\n    delete_articles_by_pk(id: $id) {\n      id\n      slug\n      title\n    }\n  }\n": types.DeleteArticleByIdDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetArticleBySlug($slug: String!) {\n    articles(where: { slug: { _eq: $slug } }) {\n      id\n      slug\n      status\n      title\n      content\n      updated_at\n      created_at\n    }\n  }\n"): (typeof documents)["\n  query GetArticleBySlug($slug: String!) {\n    articles(where: { slug: { _eq: $slug } }) {\n      id\n      slug\n      status\n      title\n      content\n      updated_at\n      created_at\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetArticleById($id: uuid!) {\n    articles_by_pk(id: $id) {\n      id\n      created_at\n      content\n      slug\n      status\n      title\n      updated_at\n    }\n  }\n"): (typeof documents)["\n  query GetArticleById($id: uuid!) {\n    articles_by_pk(id: $id) {\n      id\n      created_at\n      content\n      slug\n      status\n      title\n      updated_at\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetArticlesByStatus($status: String!) {\n    articles(where: { status: { _eq: $status } }) {\n      id\n      slug\n      title\n      updated_at\n      created_at\n    }\n  }\n"): (typeof documents)["\n  query GetArticlesByStatus($status: String!) {\n    articles(where: { status: { _eq: $status } }) {\n      id\n      slug\n      title\n      updated_at\n      created_at\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetArticles {\n    articles {\n      id\n      slug\n      title\n      status\n      updated_at\n      created_at\n    }\n  }\n"): (typeof documents)["\n  query GetArticles {\n    articles {\n      id\n      slug\n      title\n      status\n      updated_at\n      created_at\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateArticle(\n    $slug: String!\n    $title: String!\n    $content: String\n    $status: String!\n  ) {\n    insert_articles_one(\n      object: { slug: $slug, title: $title, content: $content, status: $status }\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateArticle(\n    $slug: String!\n    $title: String!\n    $content: String\n    $status: String!\n  ) {\n    insert_articles_one(\n      object: { slug: $slug, title: $title, content: $content, status: $status }\n    ) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateArticle(\n    $id: uuid!\n    $slug: String!\n    $title: String!\n    $content: String\n    $status: String!\n  ) {\n    update_articles_by_pk(\n      pk_columns: { id: $id }\n      _set: { slug: $slug, title: $title, content: $content, status: $status }\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateArticle(\n    $id: uuid!\n    $slug: String!\n    $title: String!\n    $content: String\n    $status: String!\n  ) {\n    update_articles_by_pk(\n      pk_columns: { id: $id }\n      _set: { slug: $slug, title: $title, content: $content, status: $status }\n    ) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteArticleById($id: uuid!) {\n    delete_articles_by_pk(id: $id) {\n      id\n      slug\n      title\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteArticleById($id: uuid!) {\n    delete_articles_by_pk(id: $id) {\n      id\n      slug\n      title\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;