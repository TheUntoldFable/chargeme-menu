import { PrePayProvider } from "@/context/PrePayContext"
import { TableOrderContext } from "@/context/TableOrderContext"
import { useGetAllOrders } from "@/hooks/send-payment-data"
import { useOrder } from "@/hooks/use-order"
import { useBusiness } from "@/hooks/use-business"
import { idFromParams, kindFromType, paramForKind } from "@/lib/flow"
import { GetOrderRes } from "@/models/order"
import { useBusinessStore } from "@/store/business"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
    const searchParams = useSearchParams()
    const businessIdParam = idFromParams((key) => searchParams.get(key))
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

    // The flow is decided by the type the backend returns, not by the URL param.
    const kind = kindFromType(businessData?.type)

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
                kind,
                businessData: businessData ?? null,
            })
        }
    }, [businessData, isLoadingBusinessData, businessIdParam, table, kind])

    // Once the backend has told us the type, rewrite the address bar so the
    // param reflects the flow (restaurant -> restaurantId, business -> businessId).
    // Existing QR codes open with the legacy `restaurantId`; this keeps
    // copied/shared links correct without a reload.
    useEffect(() => {
        if (isLoadingBusinessData || !businessData || !businessIdParam) return
        const desiredParam = paramForKind(kind)
        const staleParam = desiredParam === "businessId" ? "restaurantId" : "businessId"
        const url = new URL(window.location.href)
        const alreadyCorrect = url.searchParams.get(desiredParam) === businessIdParam && !url.searchParams.has(staleParam)
        if (alreadyCorrect) return
        url.searchParams.delete(staleParam)
        url.searchParams.set(desiredParam, businessIdParam)
        window.history.replaceState(null, "", url.toString())
    }, [businessData, isLoadingBusinessData, businessIdParam, kind])

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
