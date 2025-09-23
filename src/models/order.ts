export interface OrderItem {
    id: string
    menuItemId: string
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
    restaurantId: string
    orderItems: OrderItem[]
    tipEnabled: boolean
}

export interface CreateOrderItem {
    menuItemId: string
    quantity: number
    note: string
}

export interface CreateOrderRequest {
    orderItems: CreateOrderItem[]
    tableNumber: number
    numberOfGuests: number
    itemsPrice: number
    tip: number
    totalPrice: number
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
    restaurantId: string
    orderItems: OrderItem[]
    tipEnabled: boolean
}

export interface PrePayOrderResponse {
    order: PrePayOrder
    paymentLink: string
}
