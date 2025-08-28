/**
 * Calculates the distance between two geographic coordinates using the Haversine formula
 * @param lat1 - Latitude of the first point
 * @param lon1 - Longitude of the first point
 * @param lat2 - Latitude of the second point
 * @param lon2 - Longitude of the second point
 * @returns Distance in meters
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000 // Earth's radius in meters
    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    
    return R * c
}

/**
 * Converts degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
}

/**
 * Checks if a location is within a specified radius of a target location
 * @param userLat - User's latitude
 * @param userLon - User's longitude
 * @param targetLat - Target latitude
 * @param targetLon - Target longitude
 * @param radiusInMeters - Radius in meters (default: 50)
 * @returns Boolean indicating if user is within radius
 */
export function isWithinRadius(
    userLat: number,
    userLon: number,
    targetLat: number,
    targetLon: number,
    radiusInMeters: number = 50
): boolean {
    const distance = calculateDistance(userLat, userLon, targetLat, targetLon)
    return distance <= radiusInMeters
}

// Type definitions for location data
export interface Location {
    latitude: number
    longitude: number
}

export interface LocationCheckResult {
    isWithinRadius: boolean
    distance: number
    userLocation: Location | null
    error: string | null
}

