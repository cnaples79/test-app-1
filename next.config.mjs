/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_TSC_COMPILE_ON_ERROR: process.env.NEXT_PUBLIC_TSC_COMPILE_ON_ERROR || 'false', // Default to 'false' if not set
  },
};

export default nextConfig;
