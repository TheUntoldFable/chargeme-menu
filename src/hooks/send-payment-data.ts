import { API, headers } from "@/api/config"
import { CreateOrderRequest, GetOrderRes, PrePayOrderResponse } from "@/models/order"
import { UseQueryResult, useMutation, useQuery } from "@tanstack/react-query"

export const getAllOrders = async (tableId: string): Promise<GetOrderRes> => {
    const { data } = await API.get("/orders/active", { params: { tableNumber: tableId } })
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

export const useGetAllOrders = (tableId: string): UseQueryResult<GetOrderRes> => {
    return useQuery({
        queryKey: ["all-orders"],
        queryFn: () => getAllOrders(tableId),
        meta: { headers },
        retry: false,
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
