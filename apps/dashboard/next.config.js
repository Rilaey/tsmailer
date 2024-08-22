/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true
};

module.exports = {
  webpack: (config, { defaultLoaders }) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      use: [defaultLoaders.babel],
      exclude: /node_modules/
    });

    config.resolve.alias["@models"] = path.join(
      __dirname,
      "../../packages/models/src"
    );
    config.resolve.alias["@types"] = path.join(
      __dirname,
      "../../packages/types/src"
    );

    return config;
  },
  nextConfig
};
