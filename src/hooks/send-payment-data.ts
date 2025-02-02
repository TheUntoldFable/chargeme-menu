import { API } from "@/api/config"
import { Product } from "@/models/product"
import { useMutation } from "@tanstack/react-query"

export const initPayment = async (restaurantId: string, tableId: string, orderItems: Product[]) => {
    const url = `/payments/intiitate`

    try {
        const { data } = await API.post(`/${url}`, { restaurantId, tableId, orderItems })

        return data
    } catch (e) {
        throw new Error(`An error occurred when sending payment - ${e}`)
    }
}

export const joinTable = async (tableId: string) => {
    try {
        const { data } = await API.post(`/order/${tableId}}`)
        return data
    } catch (e) {
        throw new Error(`An error occurred when init payment - ${e}`)
    }
}

export const useInitPayment = () =>
    useMutation({
        mutationFn: ({ restaurantId, tableId, data }: { restaurantId: string; tableId: string; data: Product[] }) =>
            initPayment(restaurantId, tableId, data),
    })

export const useJoinTable = () =>
    useMutation({
        mutationFn: (tableId: string) => joinTable(tableId),
    })
