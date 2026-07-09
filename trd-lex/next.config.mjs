const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: isProd ? '/TRD-LEX' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
