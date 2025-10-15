import { useSearchParams } from "next/navigation"

/**
 * Custom hook to get restaurantId from search params
 */
export function useRestaurantId(): string | null {
    const searchParams = useSearchParams()
    return searchParams.get("restaurantId")
}

/**
 * Utility function to append restaurantId to a path if it exists
 */
export function withRestaurantId(path: string, restaurantId: string | null): string {
    return restaurantId ? `${path}?restaurantId=${restaurantId}` : path
}

/**
 * Utility function to build URL with restaurantId and other params
 */
export function buildUrlWithParams(basePath: string, params: Record<string, string | boolean | null>, restaurantId: string | null): string {
    const urlParams = new URLSearchParams()

    // Add all provided params
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            urlParams.set(key, value.toString())
        }
    })

    // Add restaurantId if it exists
    if (restaurantId) {
        urlParams.set("restaurantId", restaurantId)
    }

    const queryString = urlParams.toString()
    return queryString ? `${basePath}?${queryString}` : basePath
}

/**
 * Client-side utility to get restaurantId from window.location.search
 */
export function getRestaurantIdFromWindow(): string | null {
    if (typeof window === "undefined") return null
    return new URLSearchParams(window.location.search).get("restaurantId")
}
