import { PrePayProvider } from "@/context/PrePayContext"
import { TableOrderContext } from "@/context/TableOrderContext"
import { useGetAllOrders } from "@/hooks/send-payment-data"
import { useOrder } from "@/hooks/useOrder"
import { useRestaurant } from "@/hooks/useRestaurant"
import { GetOrderRes } from "@/models/order"
import { restaurantState } from "@/store/restaurant"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { Loader } from "../ui/loader"
import Center from "./Center"

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
    const searchParams = useSearchParams()
    const tableParam = searchParams.get("table")
    const isPaidParam = searchParams.get("isPaid")
    const table = tableParam !== null ? tableParam : undefined
    const [restaurantInfo, setRestaurantInfo] = useRecoilState(restaurantState)

    const { clearOrder, updateOrder, clearCart } = useOrder()

    const {
        data: restaurantData,
        isLoading: isLoadingRestaurantData,
        refetch: refetchRestaurantData,
        //! This should come from a conifg
    } = useRestaurant(process.env.NEXT_PUBLIC_RESTAURANT_ID ?? "")

    const { data, isLoading: isLoadingOrders, refetch } = useGetAllOrders(restaurantInfo.tableId)
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
                restaurantId: process.env.NEXT_PUBLIC_RESTAURANT_ID ?? "",
                tableId: table ?? "",
                restaurantData: restaurantData ?? null,
            })
        }
    }, [restaurantData, isLoadingRestaurantData])

    if (isLoadingRestaurantData || isLoadingOrders)
        return (
            <Center className='h-screen w-full flex-1 bg-[#111111]'>
                <Loader />
            </Center>
        )

    return (
        <PrePayProvider restaurantData={restaurantInfo.restaurantData ?? undefined}>
            <TableOrderContext.Provider value={{ setTableOrder, tableOrder, refetch }}>{children}</TableOrderContext.Provider>
        </PrePayProvider>
    )
}
