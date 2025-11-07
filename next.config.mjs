/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', 'cdn.yoursite.com'],
        unoptimized: true 
      },
    output: 'export',
};

export default nextConfig;
