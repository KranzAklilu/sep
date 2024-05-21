/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      loader: "node-loader",
    });
    return config;
  },
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "dp5vx9smc",
    NEXT_PUBLIC_CLOUDINARY_PRESET_NAME: "knzk48be",
  },
  domains: ["res.cloudinary.com"],
};

export default config;
