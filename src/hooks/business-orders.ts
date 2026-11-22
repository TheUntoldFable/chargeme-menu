import { API, headers } from "@/api/config"
import { BusinessOrder, CreateBusinessOrderRequest, CreateBusinessOrderResponse } from "@/models/order"
import { UseQueryResult, useMutation, useQuery } from "@tanstack/react-query"

// Live business-order payment results are published to this STOMP topic.
// (Separate from the restaurant `/topic/orders/...` topics.)
export const businessOrderTopic = (orderId: string): string => `/topic/business-orders/${orderId}`

// POST /business-orders — creates a business order and returns an Iris payment link.
export const useCreateBusinessOrder = () =>
    useMutation({
        mutationFn: async (order: CreateBusinessOrderRequest): Promise<CreateBusinessOrderResponse> => {
            const { data } = await API.post(`/business-orders`, order)
            return data
        },
        meta: { headers },
    })

// GET /business-orders/{orderId} — returns a single business order.
export const getBusinessOrderById = async (orderId: string): Promise<BusinessOrder> => {
    const { data } = await API.get(`/business-orders/${orderId}`)
    return data
}

export const useBusinessOrder = (orderId: string | null): UseQueryResult<BusinessOrder> =>
    useQuery({
        queryKey: ["business-order", orderId],
        queryFn: () => getBusinessOrderById(orderId as string),
        meta: { headers },
        enabled: !!orderId,
        retry: false,
    })
