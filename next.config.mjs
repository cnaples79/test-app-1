/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_TSC_COMPILE_ON_ERROR: 'true',
  },
  typescript: {
    // Ignore TypeScript errors during the build process
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
