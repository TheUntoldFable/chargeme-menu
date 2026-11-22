import { type BusinessType } from "@/models/business"

export type FlowKind = "restaurant" | "business"
export type FlowParam = "restaurantId" | "businessId"

/**
 * The flow is driven by the business `type` returned from the backend: a
 * `RESTAURANT` runs the restaurant flow, every other type (`BAR`, `RETAIL`,
 * `SERVICES`, `OTHER`) runs the business flow. The two flows share all UI,
 * ordering and real-time topics; they diverge only in the categories endpoint
 * and in the URL param used on links (see `flowEndpoints` / `paramForKind`).
 *
 * The entity itself is ALWAYS fetched from `/businesses/:id` — that response is
 * what tells us the type, so it cannot depend on the flow.
 */
export const kindFromType = (type?: BusinessType | null): FlowKind => (type === "RESTAURANT" ? "restaurant" : "business")

/** The URL param a given flow writes into its links. */
export const paramForKind = (kind: FlowKind): FlowParam => (kind === "business" ? "businessId" : "restaurantId")

/**
 * Reads the entity id from search params. New links use `businessId`; existing
 * QR codes in the wild use the legacy `restaurantId`. Either way the value is a
 * business id passed to `/businesses/:id`.
 */
export const idFromParams = (get: (key: string) => string | null): string | null => get("businessId") ?? get("restaurantId")

/**
 * Per-flow endpoint builders. Only the categories endpoint differs — the entity
 * is unified on `/businesses/:id`, and menu items, order creation and WS topics
 * are shared.
 */
export const flowEndpoints: Record<FlowKind, { categories: (id: string) => string }> = {
    restaurant: { categories: (id) => `/menu-items/categories/restaurant/${id}` },
    business: { categories: (id) => `/menu-items/categories/business/${id}` },
}
