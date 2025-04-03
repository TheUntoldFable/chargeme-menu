"use client"

import { API_BASE_URL } from "@/api/config"
import CartProduct from "@/components/Product/CartProduct"
import SelectedProduct from "@/components/Product/SelectedProduct"
import Center from "@/components/common/Center"
import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toggle } from "@/components/ui/toggle"
import TotalPrice from "@/components/ui/total-price"
import { useGetAllOrders } from "@/hooks/send-payment-data"
import { useOrder } from "@/hooks/useOrder"
import { useSockJS } from "@/hooks/useSockJS"
import { calculateTotalPrice } from "@/lib/utils"
import { WSSendMessageItems, WSSendMessagePayload } from "@/models/websocket"
import { restaurantState } from "@/store/restaurant"
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil"
const TOGGLE_OPTIONS: number[] = [0, 0.05, 0.1, 0.15, 0.2]

export default function Cart() {
    const { order, cartItems, setPrice, price, clearOrder } = useOrder()
    const inputRef = useRef<HTMLInputElement>(null)
    const [tempQuantity, setTempQuantity] = useState<{ [key: string]: number }>({})
    const [tip, setTip] = useState(0)
    const [inputTip, setInputTip] = useState<boolean>(false)
    const [wsMessages, setWSMessages] = useState()
    const [restaurantInfo, setRestaurantInfo] = useRecoilState(restaurantState)

    const { data: tableOrder, isLoading, refetch } = useGetAllOrders(restaurantInfo)

    const socket = useSockJS({
        url: `${API_BASE_URL}/ws`,
        topic: tableOrder ? `/topic/orders/${tableOrder.id}` : null,
        onMessage: (e) => {
            if (!e.irisPaymentLink) return
            window.location.href = e.irisPaymentLink
        },
    })

    const initPayment = useCallback(() => {
        if (!order?.orderId || !order.orderItems.length || !tableOrder) return

        //TODO: Refactor this id to be string always
        const transactionItems: WSSendMessageItems[] = order.orderItems.map((c, index) => ({
            orderItemId: tableOrder.orderItems[index].orderItemId,
            quantity: tempQuantity[c.id] || c.quantity,
        }))

        const payload: WSSendMessagePayload = {
            transactionItems,
            totalPrice: calculateTotalPrice(order.orderItems, true, tempQuantity),
            itemsPrice: calculateTotalPrice(order.orderItems, true, tempQuantity),
            tip,
            orderId: order.orderId,
        }

        if (socket.isConnected && socket.isSubscribed) {
            socket.sendMessage("/app/createTransaction", {
                ...payload,
            })

            refetch().then((e) => {
                console.log(e, "refetched Order")
            })
        } else console.log("No connection to socket!")
    }, [socket.isConnected, tableOrder, socket.isSubscribed])

    // useEffect(() => {
    //     if (!order.orderItems) return

    //     setPrice(
    //         !inputTip
    //             ? tip * Number(calculateTotalPrice(order.orderItems, true)) + Number(calculateTotalPrice(order.orderItems, true))
    //             : tip + Number(calculateTotalPrice(order.orderItems, true))
    //     )
    // }, [tip, inputTip, order.orderItems])

    const cartIncrement = (id: string | number, quantity: number) => {
        setTempQuantity((prev) => {
            if (prev[id] < quantity) prev[id] += 1
            return { ...prev }
        })
    }

    const cartDecrement = (id: string | number) => {
        setTempQuantity((prev) => {
            if (prev[id] > 1) prev[id] -= 1

            return { ...prev }
        })
    }

    useEffect(() => {
        if (!order.orderItems) return

        const mappedQuantityById: { [key: string]: number } = {}
        order.orderItems.forEach((item) => {
            mappedQuantityById[item.id] = item.quantity
        })
        setTempQuantity(mappedQuantityById)
    }, [])

    if (!order.orderItems.length || isLoading)
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
                {order.orderItems.map((item, index) => (
                    <SelectedProduct
                        key={`${item.id}-${index}`}
                        classNames='mt-8 mb-2 mx-auto'
                        increment={cartIncrement}
                        decrement={cartDecrement}
                        {...item}
                        tempQuantity={tempQuantity[item.id]}
                    >
                        <CartProduct {...item} />
                    </SelectedProduct>
                ))}
            </ScrollArea>
            <TotalPrice
                items={order.orderItems}
                withSelection={true}
                tempQuantity={tempQuantity}
                tip={tip}
                inputTip={inputTip}
            />
            <div className='flex flex-col mb-2 gap-2'>
                <h2 className='text-white'>Добавете бакшиш?</h2>
                <div className='flex flex-1 gap-1 justify-between'>
                    {TOGGLE_OPTIONS.map((option, index) => (
                        <div
                            className='flex'
                            key={option}
                        >
                            <Toggle
                                pressed={tip === option && tip !== undefined}
                                onClick={() => {
                                    setInputTip(false)
                                    setTip(option)

                                    if (inputRef.current && inputRef.current?.value) {
                                        inputRef.current.value = ""
                                    }
                                }}
                                className={`border-[2px] bg-white data-[state=on]:bg-yellow data-[state=on]:text-white border-yellow`}
                            >
                                {option * 100 + "%"}
                            </Toggle>
                        </div>
                    ))}
                </div>
                <Input
                    ref={inputRef}
                    type='number'
                    placeholder='Въведете сума'
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setInputTip(true)

                        if (e?.target?.value) {
                            setTip(Number(e.target.value))
                        }

                        if (e.target.value === "") {
                            setTip(0)
                        }
                    }}
                />
            </div>
            {/* <Link
                className='w-full flex items-center justify-center'
                href={{
                    pathname: "/payment",
                    query: {
                        totalAmount: price,
                    },
                }}
            > */}
            <Button
                onClick={initPayment}
                disabled={!order || order.orderItems.length < 1 || order.orderItems.every((item) => item.isSelected === false)}
                className='w-[90%]
           text-lg
           gap-2
           mb-4
           active:scale-75
           transition-transform
           ease-in-out'
                type='button'
                id='add'
                variant='select'
            >
                Плати
            </Button>
            {/* </Link> */}
        </Container>
    )
}
