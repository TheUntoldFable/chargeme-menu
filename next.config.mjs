/** @type {import("next").NextConfig} */

const {
  withHydrationOverlay,
} = require("next-hydration-overlay/next")

const isProd = process.env.NODE_ENV === "production"

const nextConfig = {}

export default isProd ? nextConfig : withHydrationOverlay({
  /**
   * Optional: `appRootSelector` is the selector for the root element of your app. By default, it is `#__next` which works
   * for Next.js apps with pages directory. If you are using the app directory, you should change this to `main`.
   */
  appRootSelector: "main",
})(nextConfig)


