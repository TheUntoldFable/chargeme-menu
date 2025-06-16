import { TableOrderContext } from "@/context/TableOrderContext"
import { useGetAllOrders } from "@/hooks/send-payment-data"
import { useOrder } from "@/hooks/useOrder"
import { GetOrderResponse } from "@/models/order"
import { restaurantState } from "@/store/restaurant"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import Center from "./Center"
import Container from "./container"

export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false)
    const [restaurantInfo, setRestaurantInfo] = useRecoilState(restaurantState)
    const { clearOrder, updateOrder, clearCart } = useOrder()
    const { data, isLoading, refetch } = useGetAllOrders(restaurantInfo)
    const [tableOrder, setTableOrder] = useState<GetOrderResponse | undefined>(undefined)

    useEffect(() => {
        if (restaurantInfo.restaurantId && restaurantInfo.tableId) return
        setRestaurantInfo({
            restaurantId: process.env.NEXT_PUBLIC_RESTAURANT_ID ?? "",
            tableId: Math.random() * 100,
        })
    }, [])

    useEffect(() => {
        setHasMounted(true)
    }, [])

    useEffect(() => {
        if (!data && !isLoading) {
            clearOrder()
        }

        if (data?.status === "ORDERED") {
            updateOrder(data)
        }

        if (data?.paid) {
            clearCart()
            clearOrder()
        }

        setTableOrder(data)
    }, [data])

    if (!hasMounted || isLoading) {
        return (
            <Container title=''>
                <Center>
                    <Loader />
                </Center>
            </Container>
        )
    }

    return <TableOrderContext.Provider value={{ setTableOrder, tableOrder, refetch }}>{children}</TableOrderContext.Provider>
}
