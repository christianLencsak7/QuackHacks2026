/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Turned off to avoid double-firing effects in dev during migration
    distDir: '../.next',   // Output to repo root so Vercel finds it when building from monorepo root
};

export default nextConfig;

