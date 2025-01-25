import { API_BASE_URL, headers } from "@/api/config"
import { Product } from "@/models/product"
import { useMutation } from "@tanstack/react-query"

export const sendPaymentData = async (orderItems: Product[]) => {
    const url = ""
    try {
        //Trans
        const paymentRes = await fetch(`${API_BASE_URL}/${url}`, {
            method: "POST",
            headers,
            body: JSON.stringify(orderItems),
        })

        return paymentRes.json()
    } catch (e) {
        throw new Error(`An error occurred when sending payment - ${e}`)
    }
}

export const useSendPayment = () =>
    useMutation({
        mutationFn: (data: Product[]) => {
            return sendPaymentData(data)
        },
    })
