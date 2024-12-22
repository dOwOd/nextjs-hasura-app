/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: '/',
      },
      {
        "source": "/works/steam-calculator/",
        "destination": "https://steam-api-app.pages.dev/works/steam-calculator/"
      },
      {
        "source": "/works/steam-calculator/:path*",
        "destination": "https://steam-api-app.pages.dev/works/steam-calculator/:path*"
      }
    ]
  },
}

module.exports = nextConfig
