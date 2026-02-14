import nextConfig from 'eslint-config-next'
import prettier from 'eslint-config-prettier'

const config = [
  { ignores: ['.open-next/**'] },
  ...nextConfig,
  prettier,
]

export default config
