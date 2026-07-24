import { idFromParams, paramForKind, type FlowKind, type FlowParam } from "@/lib/flow"
import { useBusinessStore } from "@/store/business"
import { useSearchParams } from "next/navigation"

interface BusinessParams {
    businessId: string | null
    table: string | null
    kind: FlowKind
    param: FlowParam
}

/**
 * Custom hook to get the entity id (from either param) from search params
 */
export function useBusinessId(): string | null {
    const searchParams = useSearchParams()
    return idFromParams((key) => searchParams.get(key))
}

/**
 * Custom hook to get table from search params
 */
export function useTableId(): string | null {
    const searchParams = useSearchParams()
    return searchParams.get("table")
}

/**
 * Custom hook to get the id, table and flow metadata. The id comes from the URL;
 * the flow `kind` comes from the store (derived from the backend `type` once the
 * business has loaded), so links carry the param that matches the resolved flow.
 */
export function useBusinessParams(): BusinessParams {
    const searchParams = useSearchParams()
    const kind = useBusinessStore((state) => state.kind)
    return {
        businessId: idFromParams((key) => searchParams.get(key)),
        table: searchParams.get("table"),
        kind,
        param: paramForKind(kind),
    }
}

/**
 * Utility function to append the flow id (under `param`) and table to a path
 */
export function withBusinessParams(
    path: string,
    businessId: string | null,
    table: string | null,
    param: FlowParam = "restaurantId"
): string {
    const params = new URLSearchParams()
    if (businessId) params.set(param, businessId)
    if (table) params.set("table", table)
    const queryString = params.toString()
    return queryString ? `${path}?${queryString}` : path
}

/**
 * Utility function to append the flow id (under `param`) to a path if it exists
 */
export function withBusinessId(path: string, businessId: string | null, param: FlowParam = "restaurantId"): string {
    return businessId ? `${path}?${param}=${businessId}` : path
}

/**
 * Utility function to build a URL with the flow id (under `param`) and other params
 */
export function buildUrlWithParams(
    basePath: string,
    params: Record<string, string | boolean | null>,
    businessId: string | null,
    table?: string | null,
    param: FlowParam = "restaurantId"
): string {
    const urlParams = new URLSearchParams()

    // Add all provided params
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            urlParams.set(key, value.toString())
        }
    })

    // Add the flow id under its param name if it exists
    if (businessId) {
        urlParams.set(param, businessId)
    }

    // Add table if it exists
    if (table) {
        urlParams.set("table", table)
    }

    const queryString = urlParams.toString()
    return queryString ? `${basePath}?${queryString}` : basePath
}

/**
 * Client-side utility to get the active id from window.location.search
 */
export function getBusinessIdFromWindow(): string | null {
    if (typeof window === "undefined") return null
    return idFromParams((key) => new URLSearchParams(window.location.search).get(key))
}

/**
 * Client-side utility to get table from window.location.search
 */
export function getTableFromWindow(): string | null {
    if (typeof window === "undefined") return null
    return new URLSearchParams(window.location.search).get("table")
}

/**
 * Client-side utility to get the id, table and flow metadata from window.location.search
 */
export function getBusinessParamsFromWindow(): BusinessParams {
    if (typeof window === "undefined") return { businessId: null, table: null, kind: "restaurant", param: "restaurantId" }
    const search = new URLSearchParams(window.location.search)
    const kind = useBusinessStore.getState().kind
    return {
        businessId: idFromParams((key) => search.get(key)),
        table: search.get("table"),
        kind,
        param: paramForKind(kind),
    }
}
