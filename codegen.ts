import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://dowod-nextjs-app.hasura.app/v1/graphql',
  documents: 'src/queries/**/*.ts',
  generates: {
    'src/gql/graphql.ts': {
      plugins: [
        'typescript-operations',
        'typescript',
        'typescript-react-apollo',
      ],
      config: {
        apolloReactHooksImportFrom: '@apollo/client/react',
      },
    },
  },
}

export default config
