export interface OrderItem {
    id: string
    // Response field renamed `menuItemId` -> `itemId` (the order-item's own id stays `orderItemId`).
    itemId: string
    note: string
    orderId: string
    paid: number
    processing: number
    quantity: number
    remaining: number
    orderItemId: string
}

//Could be the same for WS
export interface GetOrderRes {
    id: string
    remoteVendorId: string
    totalPrice: number
    remainingPrice: number
    tableNumber: number
    status: string //TODO: Replace with actual enum
    guestCount: number
    created: string // ISO date string
    updated: string // ISO date string
    paid: string | boolean
    businessId: string
    orderItems: OrderItem[]
    tipEnabled: boolean
}

// NOTE: request bodies are unchanged by the API migration — POST /orders/pre-paid
// still accepts `restaurantId`, and order items still take `menuItemId`.
export interface CreateOrderItem {
    menuItemId: string
    quantity: number
    note: string
}

export interface CreateOrderRequest {
    orderItems: CreateOrderItem[]
    tableNumber: string
    numberOfGuests: number
    itemsPrice: number
    tip: number
    totalPrice: number
    // Request wire field — unchanged by the migration (still `restaurantId`).
    restaurantId: string
}

export interface PrePayOrder {
    id: string
    remoteVendorId: string
    totalPrice: number
    remainingPrice: number
    tableNumber: number
    status: "NEW" | "ORDERED" | "COMPLETED" | "CANCELLED"
    guestCount: number
    created: string
    updated: string
    paid: string
    businessId: string
    orderItems: OrderItem[]
    tipEnabled: boolean
}

export interface PrePayOrderResponse {
    order: PrePayOrder
    paymentLink: string
}

// ---------------------------------------------------------------------------
// Business orders — a simpler, POS-less flow paid fully up front via an Iris
// payment link. See API CHANGELOG section 3.
// ---------------------------------------------------------------------------
export interface CreateBusinessOrderItem {
    itemId: string
    quantity: number
}

export interface BusinessOrderItem {
    orderItemId: string
    itemId: string
    quantity: number
}

export type BusinessOrderStatus = "NEW" | "PAID" | "CANCELLED"

export interface BusinessOrder {
    id: string
    price: number
    status: BusinessOrderStatus
    businessId: string
    created: string
    updated: string | null
    paid: string | null
    tipEnabled: boolean
    orderItems: BusinessOrderItem[]
}

export interface CreateBusinessOrderResponse {
    order: BusinessOrder
    paymentLink: string
}

export interface CreateBusinessOrderRequest {
    businessId: string
    // Must equal the sum of (menu item price x quantity); a mismatch returns 400.
    price: number
    // Must contain at least one item.
    orderItems: CreateBusinessOrderItem[]
}
