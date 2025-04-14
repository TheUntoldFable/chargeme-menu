"use client"

import { API_BASE_URL } from "@/api/config"
import CardContainer from "@/components/Product/CardContainer"
import OrderProduct from "@/components/Product/OrderProduct"
import Center from "@/components/common/Center"
import Container from "@/components/common/container"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { ScrollArea } from "@/components/ui/scroll-area"
import TotalPrice from "@/components/ui/total-price"
import { useGetAllOrders } from "@/hooks/send-payment-data"
import { useOrder } from "@/hooks/useOrder"
import { useSockJS } from "@/hooks/useSockJS"
import { calculateTotalPrice } from "@/lib/utils"
import { Product } from "@/models/product"
import { restaurantState } from "@/store/restaurant"
import { useCallback } from "react"
import { useRecoilState } from "recoil"

export default function OrderPage() {
    const { updateOrder, cartItems, increment, decrement } = useOrder()
    const [restaurantInfo, setRestaurantInfo] = useRecoilState(restaurantState)
    const { restaurantId, tableId } = restaurantInfo

    const { data: tableOrder, isLoading } = useGetAllOrders(restaurantInfo)

    const socket = useSockJS({
        url: `${API_BASE_URL}/ws`,
        topic: tableOrder ? `/topic/orders/${tableOrder.id}` : `/topic/orders/${restaurantId}/${Math.round(tableId)}`,
        onMessage: (e) => {
            if (!e.id) return
            updateOrder(e.id)
        },
    })

    //OnCreate subscribe to topic/orders/{restaurantid}/{tableid}

    const handleAccept = useCallback(() => {
        if (!cartItems.length || cartItems.length < 1) throw new Error("No order items in cart!")

        if (socket.isConnected) {
            if (tableOrder) {
                //UPDATE ORDER
                const rItems = cartItems.map((p: Product) => ({
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
                    orderId: tableOrder.id,
                })

                updateOrder(tableOrder.id)
            } else {
                //CREATE NEW ORDER
                const rItems = cartItems.map((p: Product) => ({
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
            }
        } else {
            throw new Error("No connection to socket!")
        }
    }, [socket.isConnected, cartItems, tableOrder, restaurantInfo])

    if (isLoading)
        return (
            <Container title=''>
                <Center>
                    <Loader />
                </Center>
            </Container>
        )

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
                    >
                        <OrderProduct
                            children={undefined}
                            {...item}
                            increment={increment}
                            decrement={decrement}
                        />
                    </CardContainer>
                ))}
            </ScrollArea>
            <TotalPrice
                items={cartItems}
                withSelection={false}
            />
            <AlertDialog>
                <AlertDialogTrigger
                    disabled={!cartItems || cartItems.length < 1}
                    className='w-full'
                >
                    <Button
                        disabled={!cartItems || cartItems.length < 1}
                        className='mb-4 w-[60%] gap-2 text-lg transition-transform ease-in-out active:scale-75'
                        type='button'
                        id='add'
                        variant='select'
                    >
                        {tableOrder ? "Добави към поръчка" : "Поръчай"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='max-w-[90%]'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-black'>Сигурни ли сте, че искате да продължите?</AlertDialogTitle>
                        <AlertDialogDescription>Това ще запази поръчката ви и ще ви изпрати на следващата стъпка.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Размислих</AlertDialogCancel>
                        <AlertDialogAction
                            className={`bg-alterGreen text-white hover:text-black`}
                            onClick={handleAccept}
                        >
                            Продължи
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Container>
    )
}
