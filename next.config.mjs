/** @type {import("next").NextConfig} */
import { withHydrationOverlay } from "@builder.io/react-hydration-overlay/next"

const isProd = process.env.NODE_ENV === "production"

const nextConfig = {
    images: {
        domains: ["imagedelivery.net"],
    },
}

// Export with or without hydration overlay depending on environment
export default isProd
    ? nextConfig
    : withHydrationOverlay({
          appRootSelector: "main", // Adjust if you're using the app directory
      })(nextConfig)
