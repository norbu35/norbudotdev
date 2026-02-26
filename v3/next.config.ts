import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [__dirname],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
