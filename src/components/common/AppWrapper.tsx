import { PrePayProvider } from "@/context/PrePayContext"
import { TableOrderContext } from "@/context/TableOrderContext"
import { useGetAllOrders } from "@/hooks/send-payment-data"
import { useOrder } from "@/hooks/use-order"
import { useBusiness } from "@/hooks/use-business"
import { GetOrderRes } from "@/models/order"
import { useBusinessStore } from "@/store/business"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
    const searchParams = useSearchParams()
    const businessIdParam = searchParams.get("restaurantId")
    const tableParam = searchParams.get("table")
    const isPaidParam = searchParams.get("isPaid")
    const table = tableParam !== null ? tableParam : undefined
    const { tableId, businessData: storedBusinessData, setBusinessInfo } = useBusinessStore()

    const { clearOrder, updateOrder, clearCart } = useOrder()

    const {
        data: businessData,
        isLoading: isLoadingBusinessData,
        //! This should come from a config
    } = useBusiness(businessIdParam ?? "")

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
        if (!isLoadingBusinessData) {
            setBusinessInfo({
                businessId: businessIdParam ?? "",
                tableId: table ?? "",
                businessData: businessData ?? null,
            })
        }
    }, [businessData, isLoadingBusinessData, businessIdParam, table])

    // if (isLoadingBusinessData || isLoadingOrders)
    //     return (
    //         <Center>
    //             <Loader />
    //         </Center>
    //     )

    return (
        <PrePayProvider businessData={storedBusinessData ?? undefined}>
            <TableOrderContext.Provider value={{ setTableOrder, tableOrder, refetch }}>{children}</TableOrderContext.Provider>
        </PrePayProvider>
    )
}
