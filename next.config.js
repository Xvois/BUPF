const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

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
	experimental: {
		//ppr: true,
		reactCompiler: true,
	},
}

module.exports = withBundleAnalyzer(nextConfig)