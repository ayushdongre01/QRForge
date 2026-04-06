// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "http://qrforge-backend-env.eba-un3cq3zi.ap-south-1.elasticbeanstalk.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;