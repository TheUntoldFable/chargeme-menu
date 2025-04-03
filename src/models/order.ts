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

export interface Order {
    created: string
    guestCount: number
    id: string
    orderItems: OrderItem[]
    paid: number | null
    remainingPrice: number
    remoteVendorId: string
    restaurantId: string
    status: string
    tableNumber: number
    totalPrice: number
    updated: string
}
