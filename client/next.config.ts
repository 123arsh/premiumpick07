import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const adminPath = process.env.ADMIN_PATH || 'cp-internal-manage';
const DEFAULT_API_URL = 'https://premiumpick07.onrender.com/api';

const apiHostname = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).hostname;
  } catch {
    return new URL(DEFAULT_API_URL).hostname;
  }
})();

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  env: {
    ADMIN_PATH: adminPath,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '5000', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: apiHostname, pathname: '/uploads/**' },
    ],
  },
  async rewrites() {
    return [
      {
        source: `/${adminPath}`,
        destination: '/manage',
      },
      {
        source: `/${adminPath}/:path*`,
        destination: '/manage/:path*',
      },
    ];
  },
};

export default nextConfig;
