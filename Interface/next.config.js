/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["yazasnkrz.ams3.digitaloceanspaces.com"],
    unoptimized: true, // Disable image optimization
  },

  distDir: "out",
};

module.exports = nextConfig;
