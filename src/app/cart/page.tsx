"use client"

import IconFailed from "#/public/svg/icons/IconFailed"
import IconSuccess from "#/public/svg/icons/IconSuccess"
import { API_BASE_URL } from "@/api/config"
import CardContainer from "@/components/Product/CardContainer"
import CartItem from "@/components/Product/CartItem"
import { DialogPopUp } from "@/components/common/DialogPopUp"
import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import TotalPrice from "@/components/ui/total-price"
import { useTableOrderContext } from "@/context/TableOrderContext"
import { businessOrderTopic, useCreateBusinessOrder } from "@/hooks/business-orders"
import { usePrePayOrder } from "@/hooks/send-payment-data"
import { useOrder } from "@/hooks/use-order"
import { useSockJS } from "@/hooks/use-sockjs"
import { paramForKind } from "@/lib/flow"
import { buildUrlWithParams, withBusinessParams } from "@/lib/navigation-utils"
import { calculateTotalPriceEur } from "@/lib/utils"
import { BusinessOrder, CreateOrderItem, GetOrderRes } from "@/models/order"
import { Product } from "@/models/product"
import { useBusinessStore } from "@/store/business"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

export default function CartPage() {
    const router = useRouter()
    const tCart = useTranslations("cart")
    const tCommon = useTranslations("common")

    const { tableOrder, setTableOrder } = useTableOrderContext()
    const { businessId, tableId, kind, businessData: storedBusinessData } = useBusinessStore()
    const param = paramForKind(kind)
    const {
        updateOrder,
        order,
        cartItems,
        increment,
        decrement,
        clearCart,
    } = useOrder()
    const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
    const [isOpenFailedDialog, setIsOpenFailedDialog] = useState<boolean>(false)
    const [isOpenCreateOrderFailedDialog, setIsOpenCreateOrderFailedDialog] = useState<boolean>(false)
    const [isOpenSuccessDialog, setIsOpenSuccessDialog] = useState<boolean>(false)
    const [businessOrderId, setBusinessOrderId] = useState<string | null>(null)

    const { mutateAsync: prePayOrder } = usePrePayOrder()
    const { mutateAsync: createBusinessOrder } = useCreateBusinessOrder()
    // Check if this restaurant uses pre-payment
    const isPrePayMode = !!storedBusinessData?.paymentInAdvance
    const isSelfService = !!storedBusinessData?.selfService
    // Non-restaurant businesses use the simpler POS-less business-order flow,
    // paid fully up front via an Iris payment link.
    const isBusinessOrderMode = storedBusinessData?.type === "SERVICES" || storedBusinessData?.type === "OTHER"

    const handleRouterPush = useCallback(() => {
        if (isSelfService) {
            router.push(withBusinessParams("/", businessId, tableId, param))
        } else {
            router.push(withBusinessParams("/order", businessId, tableId, param))
        }
    }, [isSelfService, businessId, tableId, param])

    const socket = useSockJS({
        url: `${API_BASE_URL}/ws`,
        topic: tableOrder ? `/topic/orders/${tableOrder?.id}` : `/topic/orders/${businessId}/${tableId}`,
        onMessage: (e: GetOrderRes) => {
            if (e.id) {
                updateOrder(e).then(() => {
                    if (cartItems.length > 0) {
                        setTableOrder(e)
                    }
                    handleRouterPush()
                })
            } else {
                setIsOpenCreateOrderFailedDialog(true)
            }
        },
        disabled: isPrePayMode || isBusinessOrderMode,
    })

    // Live business-order payment results. The primary flow redirects to the Iris
    // payment link, but if payment completes while the user is still here (e.g. paid
    // in another tab) we pick up the PAID status and send them back with success.
    useSockJS({
        url: `${API_BASE_URL}/ws`,
        topic: businessOrderId ? businessOrderTopic(businessOrderId) : null,
        onMessage: (e: BusinessOrder) => {
            if (e.status === "PAID") {
                clearCart()
                router.push(buildUrlWithParams("/", { isPaid: true }, businessId, tableId, param))
            }
        },
        disabled: !isBusinessOrderMode || !businessOrderId,
    })

    const handleCreate = useCallback(async () => {
        if (isBusinessOrderMode) {
            try {
                const res = await createBusinessOrder({
                    businessId: businessId,
                    price: Number(calculateTotalPriceEur(cartItems, false).toFixed(2)),
                    orderItems: cartItems.map((p: Product) => ({
                        itemId: p.id,
                        quantity: p.quantity,
                    })),
                })

                setBusinessOrderId(res.order.id)
                router.replace(res.paymentLink)
            } catch (error) {
                console.log(error)
                setIsOpenDialog(false)
                setIsOpenFailedDialog(true)
            }
            return
        }

        if (isPrePayMode) {
            // TODO: Implement pre-pay mode
            try {
                const res = await prePayOrder({
                    orderItems: cartItems.map((p: Product) => ({
                        menuItemId: p.id,
                        quantity: p.quantity,
                        note: "This is a note!",
                    })),
                    tableNumber: tableId,
                    numberOfGuests: 1,
                    totalPrice: Number(calculateTotalPriceEur(cartItems, false).toFixed(2)),
                    // Request wire field is still `restaurantId` (request bodies unchanged).
                    restaurantId: businessId,
                    itemsPrice: Number(calculateTotalPriceEur(cartItems, false).toFixed(2)),
                    tip: 0,
                })

                router.replace(res.paymentLink)
            } catch (error) {
                console.log(error)
                setIsOpenDialog(false)
                setIsOpenFailedDialog(true)
            }
        } else {
            if (socket.isConnected) {
                //CREATE NEW ORDER
                const rItems: CreateOrderItem[] = cartItems.map((p: Product) => ({
                    menuItemId: p.id,
                    quantity: p.quantity,
                    note: "string",
                }))

                const rItemsPrice = calculateTotalPriceEur(cartItems, false)

                socket.sendMessage("/app/createOrder", {
                    orderItems: rItems,
                    tableNumber: tableId, //Should be defined by business
                    numberOfGuests: 1, // should be calculated by BE when connecting with the table.
                    totalPrice: rItemsPrice,
                    restaurantId: businessId,
                })
            } else {
                throw new Error("No connection to socket!")
            }
        }
    }, [cartItems, businessId, socket.isConnected, isPrePayMode, isBusinessOrderMode])

    const handleUpdate = useCallback(() => {
        //Only for socket connection
        if (!cartItems.length || cartItems.length < 1) throw new Error("No order items in cart!")

        if (socket.isConnected) {
            //UPDATE ORDER
            const rItems: CreateOrderItem[] = cartItems.map((p: Product) => ({
                menuItemId: p.id,
                quantity: p.quantity,
                note: "string",
            }))

            const rItemsPrice = calculateTotalPriceEur(cartItems, false)

            socket.sendMessage("/app/updateOrder", {
                orderItems: rItems,
                tableNumber: tableId, //Should be defined by business
                numberOfGuests: 1, // should be calculated by BE when connecting with the table.
                totalPrice: rItemsPrice,
                restaurantId: businessId,
                orderId: order.orderId,
            })
        } else {
            throw new Error("No connection to socket!")
        }
    }, [socket.isConnected, cartItems, businessId, tableId, isPrePayMode])

    const handleOrderAction = () => {
        if (tableOrder && tableOrder?.status === "ORDERED") {
            handleUpdate()
        } else {
            handleCreate()
        }
        setIsOpenDialog(false)
        setIsOpenSuccessDialog(true)
    }

    // Get button text based on pre-pay mode
    const getButtonText = () => {
        if (isPrePayMode || isBusinessOrderMode) {
            return tableOrder?.status === "ORDERED" ? tCart("addAndPay") : tCart("orderAndPay")
        }
        return tableOrder?.status === "ORDERED" ? tCart("add") : tCart("order")
    }

    return (
        <Container title={tCart("selected")}>
            <ScrollArea className='calc-height min-w-full px-4 pt-4'>
                {cartItems.map((item) => (
                    <CardContainer
                        productId={item.id.toString()}
                        classNames='mb-6 mx-auto bg-lightBg'
                        isWine={false}
                        key={`${item.id}-container`}
                        isBlocked={false}
                        image={item.image}
                    >
                        <CartItem
                            {...item}
                            increment={increment}
                            decrement={decrement}
                        />
                    </CardContainer>
                ))}
            </ScrollArea>
            <div className='flex w-full flex-col items-center p-4'>
                <TotalPrice
                    items={cartItems}
                    withSelection={false}
                />
                <Button
                    onClick={() => setIsOpenDialog(true)}
                    disabled={!cartItems || cartItems.length < 1}
                    className='mb-4 w-[60%] gap-2 text-lg transition-transform ease-in-out active:scale-75'
                    type='button'
                    id='add'
                    variant='select'
                >
                    {getButtonText()}
                </Button>
                <DialogPopUp
                    title={tCart("confirmDialog.title")}
                    description={tCart("confirmDialog.description")}
                    defaultTitle={tCommon("yes")}
                    cancelTitle={tCommon("no")}
                    isOpen={isOpenDialog}
                    onConfirm={handleOrderAction}
                    onCancel={() => setIsOpenDialog(false)}
                    shouldConfirm
                />
                <DialogPopUp
                    icon={<IconFailed />}
                    title={tCart("createOrderFailed.title")}
                    description={tCart("createOrderFailed.description")}
                    defaultTitle={tCommon("ok")}
                    isOpen={isOpenCreateOrderFailedDialog}
                    onConfirm={() => setIsOpenCreateOrderFailedDialog(false)}
                />
                <DialogPopUp
                    icon={<IconSuccess />}
                    title={tCart("orderSuccess.title")}
                    description={
                        <span className='block text-center'>
                            {isSelfService ? tCart("orderSuccess.description") : tCart("orderSuccess.descriptionDefault")}
                        </span>
                    }
                    defaultTitle={tCommon("ok")}
                    isOpen={isOpenSuccessDialog}
                    onConfirm={() => {
                        setIsOpenSuccessDialog(false)
                        handleRouterPush()
                    }}
                />
            </div>
        </Container>
    )
}
