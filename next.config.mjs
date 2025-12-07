/** @type {import("next").NextConfig} */
import { withHydrationOverlay } from "@builder.io/react-hydration-overlay/next"

const isProd = process.env.NODE_ENV === "production"

const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "imagedelivery.net",
            },
        ],
    },
    // Disable static generation to avoid Recoil SSR issues
    experimental: {
        // This ensures all pages are rendered dynamically
    },
}

// Export with or without hydration overlay depending on environment
export default isProd
    ? nextConfig
    : withHydrationOverlay({
          appRootSelector: "main", // Adjust if you're using the app directory
      })(nextConfig)
