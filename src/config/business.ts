import type { Location } from "@/lib/location-utils"

/**
 * Business configuration
 * Update these values with your actual business coordinates
 */
export const BUSINESS_CONFIG = {
    // Business location coordinates
    location: {
        latitude: 42.0151296, // Replace with your business's latitude
        longitude: 23.1047168, // Replace with your business's longitude
    } as Location,

    // Radius in meters for location check
    radiusInMeters: 50,

    // Business information
    info: {
        name: "Your Business Name",
        address: "Your Business Address",
    },
} as const

// Type-safe getter functions
export const getBusinessLocation = (): Location => BUSINESS_CONFIG.location
export const getBusinessRadius = (): number => BUSINESS_CONFIG.radiusInMeters
export const getBusinessInfo = () => BUSINESS_CONFIG.info
