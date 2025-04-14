import { API, headers } from "@/api/config"
import { calculateTotalPrice } from "@/lib/utils"
import { Order } from "@/models/order"
import { Product } from "@/models/product"
import { RestaurantInfo } from "@/store/restaurant"
import { UseQueryResult, useMutation, useQuery } from "@tanstack/react-query"

export const initOrder = async (orderItems: Product[]) => {
    const url = `/orders`
    const rID = process.env.NEXT_PUBLIC_RESTAURANT_ID

    try {
        if (!orderItems.length || orderItems.length < 1) throw new Error("No order items in cart!")

        const rItems = orderItems.map((p: Product) => ({
            menuItemId: p.id,
            quantity: p.quantity,
            note: "string",
        }))

        const rItemsPrice = calculateTotalPrice(orderItems, false)

        const { data } = await API.post(`${url}`, {
            orderItems: rItems,
            tableNumber: Math.random() * 10 * (Math.random() * 10), //Should be defined by restaurant
            numberOfGuests: 1, // should be calculated by BE when connecting with the table.
            totalPrice: rItemsPrice,
            restaurantId: rID,
        })

        return data
    } catch (e) {
        throw new Error(`An error occurred when sending payment: ${e}`)
    }
}

export const getAllOrders = async (restaurantInfo: RestaurantInfo): Promise<unknown> => {
    const rID = process.env.NEXT_PUBLIC_RESTAURANT_ID
    const { data } = await API.get(`/orders/restaurant/${rID}/${Math.floor(restaurantInfo.tableId)}`)

    return data
}

export const getOrderById = async (id: string | null) => {
    const url = `/orders/${id}`

    try {
        if (!id) throw new Error("No orderId present")

        const { data } = await API.get(`/${url}`)
        return data
    } catch (e) {
        throw new Error(`An error occurred when creating order - ${e}`)
    }
}

export const updateOrder = async (orderId: string) => {
    const url = `/app/createTransaction`

    try {
        const { data } = await API.put(`/${url}`, { orderId })
        return data
    } catch (e) {
        throw new Error(`An error occurred when updating order - ${e}`)
    }
}

export const useInitOrder = () =>
    useMutation({
        mutationFn: (data: Product[]) => initOrder(data),
    })

export const useGetAllOrders = (restaurantInfo: RestaurantInfo): UseQueryResult<Order> => {
    return useQuery({
        queryKey: ["all-orders", restaurantInfo.tableId],
        queryFn: () => getAllOrders(restaurantInfo),
        meta: { headers },
        retry: false,
    })
}

export const useGetOrderById = (id: string | null): UseQueryResult => {
    return useQuery({
        retry: false,
        enabled: !!id,
        queryKey: ["order-by-id", id],
        queryFn: () => getOrderById(id),
        meta: { headers },
    })
}
