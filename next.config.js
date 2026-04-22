// next.config.js — Next.js configuration for static export and GitHub Pages deployment.

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export as a fully static site — required for GitHub Pages (no Node.js server)
  output: "export",

  // Must match your GitHub repo name exactly — GitHub Pages serves at /repo-name/
  basePath: "/git-github.com-Dreadseer-CodeBoxx-Intro-to-Dev",

  // Required when using basePath so all static assets (JS, CSS) use the correct path
  assetPrefix: "/git-github.com-Dreadseer-CodeBoxx-Intro-to-Dev",

  // next/image can't optimize images at build time without a server — disable it
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
