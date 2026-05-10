import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".next-build",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i1-vnexpress.vnecdn.net" },
      { protocol: "https", hostname: "file3.qdnd.vn" },
      { protocol: "https", hostname: "cdn.nhandan.vn" },
      { protocol: "https", hostname: "cdn2.tuoitre.vn" },
      { protocol: "https", hostname: "baogiaothong.mediacdn.vn" },
      { protocol: "https", hostname: "suckhoedoisong.qltns.mediacdn.vn" },
      { protocol: "https", hostname: "images2.thanhnien.vn" },
    ],
  },
};

export default bundleAnalyzer(nextConfig);
