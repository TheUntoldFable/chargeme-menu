import type { Location } from "@/lib/location-utils"

/**
 * Restaurant configuration
 * Update these values with your actual restaurant coordinates
 */
export const RESTAURANT_CONFIG = {
    // Restaurant location coordinates
    location: {
        latitude: 42.0151296, // Replace with your restaurant's latitude
        longitude: 23.1047168, // Replace with your restaurant's longitude
    } as Location,

    // Radius in meters for location check
    radiusInMeters: 50,

    // Restaurant information
    info: {
        name: "Your Restaurant Name",
        address: "Your Restaurant Address",
    },
} as const

// Type-safe getter functions
export const getRestaurantLocation = (): Location => RESTAURANT_CONFIG.location
export const getRestaurantRadius = (): number => RESTAURANT_CONFIG.radiusInMeters
export const getRestaurantInfo = () => RESTAURANT_CONFIG.info
