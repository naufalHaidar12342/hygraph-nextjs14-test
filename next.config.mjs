/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "media.graphassets.com",
				port: "",
				pathname: "/**",
			},
		],
		formats: ["image/avif", "image/webp"],
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
};

export default nextConfig;
