/** @type {import('next').NextConfig} */

// When building for GitHub Pages we produce a fully static export served
// from https://<user>.github.io/<repo>/ , so we need a basePath.
const isPages = process.env.BUILD_TARGET === "pages";
const repo = "creators-platform";

const nextConfig = isPages
  ? {
      output: "export",
      basePath: `/${repo}`,
      assetPrefix: `/${repo}/`,
      images: { unoptimized: true },
      trailingSlash: true,
    }
  : {};

export default nextConfig;
