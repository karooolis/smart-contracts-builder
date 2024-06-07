/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");

    config.module.rules.push({
      test: /\.sol$/,
      use: [
        {
          loader: 'solidity-loader',
          options: {
            // Loader options go here
          }
        }
      ]
    })

    config.module.rules.push({
      test: /\.sol$/,
      type: 'asset/source'
    });

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
