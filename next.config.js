/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  transpilePackages: ['@apollo/client'],
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
