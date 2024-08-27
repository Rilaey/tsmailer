/** @type {import('next').NextConfig} */

import path from "path";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { defaultLoaders }) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      use: [defaultLoaders.babel],
      exclude: /node_modules/
    });

    config.resolve.alias["@models"] = path.join(
      path.resolve(),
      "../../packages/models/src"
    );
    config.resolve.alias["@types"] = path.join(
      path.resolve(),
      "../../packages/types/src"
    );
    config.resolve.alias["@enums"] = path.join(
      path.resolve(),
      "../../packages/enums/src"
    );

    return config;
  }
};

export default nextConfig;
