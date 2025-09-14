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
export interface GetOrderResponse {
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
