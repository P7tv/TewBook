/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle pdf-parse module
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse',
      })
    }
    
    // Handle node modules that might not work in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    }
    
    return config
  },
}

export default nextConfig
