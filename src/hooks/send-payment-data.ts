import { API, headers } from "@/api/config"
import { CreateOrderRequest, GetOrderRes, PrePayOrderResponse } from "@/models/order"
import { RestaurantInfo } from "@/store/restaurant"
import { UseQueryResult, useMutation, useQuery } from "@tanstack/react-query"

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

export const usePrePayOrder = () =>
    useMutation({
        mutationFn: async (order: CreateOrderRequest): Promise<PrePayOrderResponse> => {
            const { data } = await API.post(`/orders/pre-paid`, order)
            return data
        },
        meta: { headers },
    })

export const useGetAllOrders = (restaurantInfo: RestaurantInfo): UseQueryResult<GetOrderRes> => {
    return useQuery({
        queryKey: ["all-orders", restaurantInfo.tableId],
        queryFn: () => getAllOrders(restaurantInfo),
        meta: { headers },
        retry: false,
        enabled: !!restaurantInfo.tableId,
    })
}

export const useGetOrderById = (id: string | null): UseQueryResult<GetOrderRes> => {
    return useQuery({
        retry: false,
        enabled: !!id,
        queryKey: ["order-by-id", id],
        queryFn: () => getOrderById(id),
        meta: { headers },
    })
}
