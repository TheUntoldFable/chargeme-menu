import { PrePayProvider } from "@/context/PrePayContext"
import { TableOrderContext } from "@/context/TableOrderContext"
import { useGetAllOrders } from "@/hooks/send-payment-data"
import { useOrder } from "@/hooks/use-order"
import { useRestaurant } from "@/hooks/use-restaurant"
import { GetOrderRes } from "@/models/order"
import { useRestaurantStore } from "@/store/restaurant"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
    const searchParams = useSearchParams()
    const restaurantIdParam = searchParams.get("restaurantId")
    const tableParam = searchParams.get("table")
    const isPaidParam = searchParams.get("isPaid")
    const table = tableParam !== null ? tableParam : undefined
    const { tableId, restaurantData: storedRestaurantData, setRestaurantInfo } = useRestaurantStore()

    const { clearOrder, updateOrder, clearCart } = useOrder()

    const {
        data: restaurantData,
        isLoading: isLoadingRestaurantData,
        //! This should come from a config
    } = useRestaurant(restaurantIdParam ?? "")

    const { data, isLoading: isLoadingOrders, refetch } = useGetAllOrders(tableId)
    const [tableOrder, setTableOrder] = useState<GetOrderRes | undefined>(undefined)

    useEffect(() => {
        if (!data && !isLoadingOrders) {
            clearOrder()
        }

        if (data?.status === "ORDERED") {
            updateOrder(data)
        }

        if (data?.paid || isPaidParam) {
            clearCart()
            clearOrder()
        }

        setTableOrder(data)
    }, [data, isPaidParam])

    useEffect(() => {
        if (!isLoadingRestaurantData) {
            setRestaurantInfo({
                restaurantId: restaurantIdParam ?? "",
                tableId: table ?? "",
                restaurantData: restaurantData ?? null,
            })
        }
    }, [restaurantData, isLoadingRestaurantData, restaurantIdParam, table])

    // if (isLoadingRestaurantData || isLoadingOrders)
    //     return (
    //         <Center>
    //             <Loader />
    //         </Center>
    //     )

    return (
        <PrePayProvider restaurantData={storedRestaurantData ?? undefined}>
            <TableOrderContext.Provider value={{ setTableOrder, tableOrder, refetch }}>{children}</TableOrderContext.Provider>
        </PrePayProvider>
    )
}
