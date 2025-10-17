"use client"

import IconFailed from "#/public/svg/icons/IconFailed"
import { API_BASE_URL } from "@/api/config"
import CardContainer from "@/components/Product/CardContainer"
import CartItem from "@/components/Product/CartItem"
import DialogPopUp from "@/components/common/DialogPopUp"
import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import TotalPrice from "@/components/ui/total-price"
import { usePrePay } from "@/context/PrePayContext"
import { useTableOrder } from "@/context/TableOrderContext"
import { usePrePayOrder } from "@/hooks/send-payment-data"
import { useOrder } from "@/hooks/useOrder"
import { useSockJS } from "@/hooks/useSockJS"
import { calculateTotalPrice } from "@/lib/utils"
import { CreateOrderItem, GetOrderRes } from "@/models/order"
import { Product } from "@/models/product"
import { restaurantState } from "@/store/restaurant"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { useRecoilState } from "recoil"

export default function CartPage() {
    const router = useRouter()
    const [restaurantInfo] = useRecoilState(restaurantState)
    const { restaurantData } = usePrePay()

    const { updateOrder, order, cartItems, increment, decrement } = useOrder()
    const { restaurantId, tableId } = restaurantInfo
    const [isOpenDialog, setIsOpenDialog] = useState(false)
    const [isOpenFailedDialog, setIsOpenFailedDialog] = useState(false)

    const { tableOrder, setTableOrder } = useTableOrder()
    const { mutateAsync: prePayOrder } = usePrePayOrder()

    // Check if this restaurant uses pre-payment
    const isPrePayMode = restaurantData?.paymentInAdvance ?? false
    console.log(restaurantInfo)

    const socket = useSockJS({
        url: `${API_BASE_URL}/ws`,
        topic: tableOrder ? `/topic/orders/${tableOrder.id}` : `/topic/orders/${restaurantId}/${tableId}`,
        onMessage: (e: GetOrderRes) => {
            if (e.id) {
                updateOrder(e).then(() => {
                    if (cartItems.length > 0) {
                        setTableOrder(e)
                    }
                })
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
                    tableNumber: restaurantInfo.tableId,
                    numberOfGuests: 1,
                    totalPrice: Number(calculateTotalPrice(cartItems, false).toFixed(2)),
                    restaurantId: restaurantInfo.restaurantId,
                    itemsPrice: Number(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)),
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

                const rItemsPrice = calculateTotalPrice(cartItems, false)

                socket.sendMessage("/app/createOrder", {
                    orderItems: rItems,
                    tableNumber: restaurantInfo.tableId, //Should be defined by restaurant
                    numberOfGuests: 1, // should be calculated by BE when connecting with the table.
                    totalPrice: rItemsPrice,
                    restaurantId: restaurantInfo.restaurantId,
                })

                console.log("ORDER CREATED")
            } else {
                throw new Error("No connection to socket!")
            }
        }
    }, [cartItems, restaurantId, socket.isConnected, isPrePayMode])

    const handleUpdate = useCallback(() => {
        if (!cartItems.length || cartItems.length < 1) throw new Error("No order items in cart!")

        if (socket.isConnected) {
            //UPDATE ORDER
            const rItems: CreateOrderItem[] = cartItems.map((p: Product) => ({
                menuItemId: p.id,
                quantity: p.quantity,
                note: "string",
            }))

            const rItemsPrice = calculateTotalPrice(cartItems, false)

            socket.sendMessage("/app/updateOrder", {
                orderItems: rItems,
                tableNumber: restaurantInfo.tableId, //Should be defined by restaurant
                numberOfGuests: 1, // should be calculated by BE when connecting with the table.
                totalPrice: rItemsPrice,
                restaurantId: restaurantInfo.restaurantId,
                orderId: order.orderId,
            })
            console.log("ORDER UPDATED")
        } else {
            throw new Error("No connection to socket!")
        }
    }, [socket.isConnected, cartItems, restaurantInfo, isPrePayMode])

    const handleOrderAction = () => {
        tableOrder && tableOrder?.status === "ORDERED" ? handleUpdate() : handleCreate()
    }

    // Get button text based on pre-pay mode
    const getButtonText = () => {
        if (isPrePayMode) {
            return tableOrder?.status === "ORDERED" ? "Добави и плати" : "Поръчай и плати"
        }
        return tableOrder?.status === "ORDERED" ? "Добави" : "Поръчай"
    }

    return (
        <Container title='Избрано'>
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
                    title='Сигурни ли сте, че искате да продължите?'
                    description={
                        isPrePayMode
                            ? "Това ще запази поръчката ви и ще ви изпрати към плащането."
                            : "Това ще запази поръчката ви и ще ви изпрати на следващата стъпка."
                    }
                    defaultTitle='Да'
                    cancelTitle='Не'
                    isOpen={isOpenDialog}
                    onConfirm={handleOrderAction}
                    onCancel={() => setIsOpenDialog(false)}
                    shouldConfirm
                />
                <DialogPopUp
                    icon={<IconFailed />}
                    title='Неуспешно плащане!'
                    description={"Възникна грешка по време на плащането, моля опитайте пак."}
                    defaultTitle='Продължи'
                    isOpen={isOpenFailedDialog}
                    onConfirm={() => setIsOpenFailedDialog(false)}
                />
            </div>
        </Container>
    )
}
