/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
        port: '',
        pathname: '/**',
      },
      // Add other allowed hostnames here if needed
    ],
  },
  // Add other Next.js configurations here
};

module.exports = nextConfig; 