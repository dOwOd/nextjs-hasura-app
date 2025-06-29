/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: '/',
      },
    ]
  },
}

module.exports = nextConfig
