/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qcmtzt61nkeydpcw.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**'
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
};

module.exports = nextConfig;