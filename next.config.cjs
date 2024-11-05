

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'uyadlyphtuclcowrmrem.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
}

module.exports = nextConfig