"use client"

import IconFailed from "#/public/svg/icons/IconFailed"
import { API_BASE_URL } from "@/api/config"
import CardContainer from "@/components/Product/CardContainer"
import CartItem from "@/components/Product/CartItem"
import { DialogPopUp } from "@/components/common/DialogPopUp"
import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import TotalPrice from "@/components/ui/total-price"
import { useTableOrderContext } from "@/context/TableOrderContext"
import { usePrePayOrder } from "@/hooks/send-payment-data"
import { useOrder } from "@/hooks/use-order"
import { useSockJS } from "@/hooks/use-sockjs"
import { withRestaurantParams } from "@/lib/navigation-utils"
import { calculateTotalPriceEur } from "@/lib/utils"
import { CreateOrderItem, GetOrderRes } from "@/models/order"
import { Product } from "@/models/product"
import { useRestaurantStore } from "@/store/restaurant"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

export default function CartPage() {
    const router = useRouter()
    const tCart = useTranslations("cart")
    const tCommon = useTranslations("common")

    const { tableOrder, setTableOrder } = useTableOrderContext()
    const { restaurantId, tableId, restaurantData: storedRestaurantData } = useRestaurantStore()
    const { updateOrder, order, cartItems, increment, decrement } = useOrder()
    const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
    const [isOpenFailedDialog, setIsOpenFailedDialog] = useState<boolean>(false)
    const [isOpenCreateOrderFailedDialog, setIsOpenCreateOrderFailedDialog] = useState<boolean>(false)

    const { mutateAsync: prePayOrder } = usePrePayOrder()
    // Check if this restaurant uses pre-payment
    const isPrePayMode = !!storedRestaurantData?.paymentInAdvance

    const socket = useSockJS({
        url: `${API_BASE_URL}/ws`,
        topic: tableOrder ? `/topic/orders/${tableOrder?.id}` : `/topic/orders/${restaurantId}/${tableId}`,
        onMessage: (e: GetOrderRes) => {
            if (e.id) {
                updateOrder(e).then(() => {
                    if (cartItems.length > 0) {
                        setTableOrder(e)
                    }
                    router.push(withRestaurantParams("/order", restaurantId, tableId))
                })
            } else {
                setIsOpenCreateOrderFailedDialog(true)
            }
        },
        disabled: isPrePayMode,
    })

    const handleCreate = useCallback(async () => {
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
                    restaurantId: restaurantId,
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
                    tableNumber: tableId, //Should be defined by restaurant
                    numberOfGuests: 1, // should be calculated by BE when connecting with the table.
                    totalPrice: rItemsPrice,
                    restaurantId: restaurantId,
                })

                setIsOpenDialog(false)
            } else {
                throw new Error("No connection to socket!")
            }
        }
    }, [cartItems, restaurantId, socket.isConnected, isPrePayMode])

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
                tableNumber: tableId, //Should be defined by restaurant
                numberOfGuests: 1, // should be calculated by BE when connecting with the table.
                totalPrice: rItemsPrice,
                restaurantId: restaurantId,
                orderId: order.orderId,
            })
        } else {
            throw new Error("No connection to socket!")
        }
    }, [socket.isConnected, cartItems, restaurantId, tableId, isPrePayMode])

    const handleOrderAction = () => {
        if (tableOrder && tableOrder?.status === "ORDERED") {
            handleUpdate()
        } else {
            handleCreate()
        }
    }

    // Get button text based on pre-pay mode
    const getButtonText = () => {
        if (isPrePayMode) {
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
            </div>
        </Container>
    )
}
