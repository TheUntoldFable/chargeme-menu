"use client"

import { API_BASE_URL } from "@/api/config"
import OrderProduct from "@/components/Product/OrderProduct"
import SelectedProduct from "@/components/Product/SelectedProduct"
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
    const { updateOrder, cartItems, order, handleRemoveFromCart, increment, decrement } = useOrder()
    const [restaurantInfo, setRestaurantInfo] = useRecoilState(restaurantState)
    const { restaurantId, tableId } = restaurantInfo

    const { data: tableOrder, isLoading, refetch } = useGetAllOrders(restaurantInfo)

    console.log(tableOrder, "tableOrder")

    const socket = useSockJS({
        url: `${API_BASE_URL}/ws`,
        topic: tableOrder ? `/topic/orders/${tableOrder.id}` : `/topic/orders/${restaurantId}/${Math.round(tableId)}`,
        onMessage: (e) => {
            console.log(e, "e")
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
            <Container>
                <Center>
                    <Loader />
                </Center>
            </Container>
        )

    return (
        <Container>
            <ScrollArea className='h-screen min-w-full'>
                {cartItems.map((item) => (
                    <SelectedProduct
                        key={item.id}
                        classNames='mt-8 mb-2 mx-auto'
                        increment={increment}
                        decrement={decrement}
                        {...item}
                    >
                        <OrderProduct {...item} />
                    </SelectedProduct>
                ))}
            </ScrollArea>
            <TotalPrice
                items={cartItems}
                withSelection={false}
            />
            <AlertDialog>
                <AlertDialogTrigger className='w-[90%]'>
                    <Button
                        disabled={!cartItems || cartItems.length < 1}
                        className='
                          text-lg
                          w-[100%]
            gap-2
            mb-4
            active:scale-75
            transition-transform
            ease-in-out'
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
                    <AlertDialogFooter className='flex gap-3'>
                        <AlertDialogAction
                            onClick={handleAccept}
                            className='flex flex-1'
                        >
                            Потвърди
                        </AlertDialogAction>
                        <AlertDialogCancel className='flex flex-1'>Размислих</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button
                className='w-[90%] text-lg gap-2 mb-4'
                type='button'
                id='add'
                variant='outline'
                onClick={handleRemoveFromCart}
            >
                <p className='text-lighterGray'>Изчисти моят избор</p>
            </Button>
        </Container>
    )
}
