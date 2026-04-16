/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // Temporarily disabled for dev — re-enable for production deploy
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
