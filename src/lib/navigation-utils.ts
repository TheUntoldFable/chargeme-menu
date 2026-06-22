import { useSearchParams } from "next/navigation"

/**
 * Custom hook to get businessId from search params
 */
export function useBusinessId(): string | null {
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
 * Custom hook to get both businessId and table from search params
 */
export function useBusinessParams(): { businessId: string | null; table: string | null } {
    const searchParams = useSearchParams()
    return {
        businessId: searchParams.get("restaurantId"),
        table: searchParams.get("table"),
    }
}

/**
 * Utility function to append businessId and table to a path if they exist
 */
export function withBusinessParams(path: string, businessId: string | null, table: string | null): string {
    const params = new URLSearchParams()
    if (businessId) params.set("restaurantId", businessId)
    if (table) params.set("table", table)
    const queryString = params.toString()
    return queryString ? `${path}?${queryString}` : path
}

/**
 * Utility function to append businessId to a path if it exists (legacy)
 */
export function withBusinessId(path: string, businessId: string | null): string {
    return businessId ? `${path}?restaurantId=${businessId}` : path
}

/**
 * Utility function to build URL with businessId and other params
 */
export function buildUrlWithParams(
    basePath: string,
    params: Record<string, string | boolean | null>,
    businessId: string | null,
    table?: string | null
): string {
    const urlParams = new URLSearchParams()

    // Add all provided params
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            urlParams.set(key, value.toString())
        }
    })

    // Add businessId if it exists
    if (businessId) {
        urlParams.set("restaurantId", businessId)
    }

    // Add table if it exists
    if (table) {
        urlParams.set("table", table)
    }

    const queryString = urlParams.toString()
    return queryString ? `${basePath}?${queryString}` : basePath
}

/**
 * Client-side utility to get businessId from window.location.search
 */
export function getBusinessIdFromWindow(): string | null {
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
 * Client-side utility to get both businessId and table from window.location.search
 */
export function getBusinessParamsFromWindow(): { businessId: string | null; table: string | null } {
    if (typeof window === "undefined") return { businessId: null, table: null }
    const params = new URLSearchParams(window.location.search)
    return {
        businessId: params.get("restaurantId"),
        table: params.get("table"),
    }
}
