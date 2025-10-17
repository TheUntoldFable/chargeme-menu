import { useSearchParams } from "next/navigation"

/**
 * Custom hook to get restaurantId from search params
 */
export function useRestaurantId(): string | null {
    const searchParams = useSearchParams()
    return searchParams.get("restaurantId")
}

/**
 * Custom hook to get table from search params
 */
export function useTableId(): string | null {
    const searchParams = useSearchParams()
    return searchParams.get("table")
}

/**
 * Custom hook to get both restaurantId and table from search params
 */
export function useRestaurantParams(): { restaurantId: string | null; table: string | null } {
    const searchParams = useSearchParams()
    return {
        restaurantId: searchParams.get("restaurantId"),
        table: searchParams.get("table"),
    }
}

/**
 * Utility function to append restaurantId and table to a path if they exist
 */
export function withRestaurantParams(path: string, restaurantId: string | null, table: string | null): string {
    const params = new URLSearchParams()
    if (restaurantId) params.set("restaurantId", restaurantId)
    if (table) params.set("table", table)
    const queryString = params.toString()
    return queryString ? `${path}?${queryString}` : path
}

/**
 * Utility function to append restaurantId to a path if it exists (legacy)
 */
export function withRestaurantId(path: string, restaurantId: string | null): string {
    return restaurantId ? `${path}?restaurantId=${restaurantId}` : path
}

/**
 * Utility function to build URL with restaurantId and other params
 */
export function buildUrlWithParams(
    basePath: string,
    params: Record<string, string | boolean | null>,
    restaurantId: string | null,
    table?: string | null
): string {
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

    // Add table if it exists
    if (table) {
        urlParams.set("table", table)
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

/**
 * Client-side utility to get table from window.location.search
 */
export function getTableFromWindow(): string | null {
    if (typeof window === "undefined") return null
    return new URLSearchParams(window.location.search).get("table")
}

/**
 * Client-side utility to get both restaurantId and table from window.location.search
 */
export function getRestaurantParamsFromWindow(): { restaurantId: string | null; table: string | null } {
    if (typeof window === "undefined") return { restaurantId: null, table: null }
    const params = new URLSearchParams(window.location.search)
    return {
        restaurantId: params.get("restaurantId"),
        table: params.get("table"),
    }
}
