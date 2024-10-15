/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["localhost", "yazasnkrz.ams3.digitaloceanspaces.com"],
    unoptimized: true, // Disable image optimization
  },
  output: "export",

  exportTrailingSlash: true, // Adds trailing slashes to URLs like `/about/`
  distDir: "out",
};

module.exports = nextConfig;
