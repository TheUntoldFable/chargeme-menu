import { GetOrderRes } from "@/models/order"
import { createContext, useContext } from "react"

export const TableOrderContext = createContext<{
    tableOrder: GetOrderRes | undefined
    setTableOrder: (order: GetOrderRes | undefined) => void
    refetch: () => void
} | null>(null)

export const useTableOrder = () => {
    const context = useContext(TableOrderContext)
    if (!context) {
        throw new Error("useTableOrder must be used within a TableOrderProvider")
    }
    return context
}
