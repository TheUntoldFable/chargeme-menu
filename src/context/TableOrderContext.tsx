import { GetOrderResponse } from "@/models/order"
import { createContext, useContext } from "react"

export const TableOrderContext = createContext<{
    tableOrder: GetOrderResponse | undefined
    setTableOrder: (order: any) => void
    refetch: () => void
} | null>(null)

export const useTableOrder = () => {
    const context = useContext(TableOrderContext)
    if (!context) {
        throw new Error("useTableOrder must be used within a TableOrderProvider")
    }
    return context
}
