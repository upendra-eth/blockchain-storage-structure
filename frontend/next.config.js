/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repo =
  (process.env.GITHUB_REPOSITORY || "").split("/")[1] || process.env.REPO_NAME || "";
const basePath = isGithubActions && repo ? `/${repo}` : "";

const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages needs a fully static export.
  output: "export",
  // Ensures routes work on static hosts (e.g., /bitcoin/ instead of /bitcoin).
  trailingSlash: true,
  // GitHub Pages serves the site from /<repo>.
  basePath,
  assetPrefix: basePath,
  // next/image optimizer isn't available on GitHub Pages.
  images: { unoptimized: true },
};

module.exports = nextConfig;
