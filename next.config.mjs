/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    config.externals.push("pino-pretty", "lokijs", "encoding")
    return config
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Match all API routes
        destination: "https://logs.dynamicauth.com/api/v1/:path*", // Proxy to the external API
      },
    ]
  },
}

module.exports = nextConfig
