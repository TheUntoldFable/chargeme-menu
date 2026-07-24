export type FlowKind = "restaurant" | "business"
export type FlowParam = "restaurantId" | "businessId"

export interface Flow {
    kind: FlowKind
    param: FlowParam
    id: string | null
}

/**
 * Resolves the active flow from a param getter (URLSearchParams-style).
 *
 * `?businessId=` selects the business flow; otherwise we fall back to
 * `?restaurantId=` — the legacy param carried by existing QR codes — which
 * selects the restaurant flow. The two flows share all UI, ordering and
 * real-time topics; they diverge only in the URL param name and in the
 * entity/categories endpoints (see `flowEndpoints`).
 */
export function resolveFlow(get: (key: string) => string | null): Flow {
    const businessId = get("businessId")
    if (businessId) return { kind: "business", param: "businessId", id: businessId }
    return { kind: "restaurant", param: "restaurantId", id: get("restaurantId") }
}

/** The URL param name a given flow writes into links. */
export const paramForKind = (kind: FlowKind): FlowParam => (kind === "business" ? "businessId" : "restaurantId")

/**
 * Per-flow endpoint builders. Only endpoints that actually differ between the
 * flows live here — everything else (menu items, order creation, WS topics) is
 * shared and stays hard-coded at its call site.
 */
export const flowEndpoints: Record<FlowKind, { entity: (id: string) => string; categories: (id: string) => string }> = {
    restaurant: {
        entity: (id) => `/restaurants/${id}`,
        categories: (id) => `/menu-items/categories/restaurant/${id}`,
    },
    business: {
        entity: (id) => `/businesses/${id}`,
        categories: (id) => `/menu-items/categories/business/${id}`,
    },
}
