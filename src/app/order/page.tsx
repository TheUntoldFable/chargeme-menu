"use client"
import { API_BASE_URL } from "@/api/config"
import CardContainer from "@/components/Product/CardContainer"
import PaymentProduct from "@/components/Product/PaymentProduct"
import DialogPopUp from "@/components/common/DialogPopUp"
import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toggle } from "@/components/ui/toggle"
import { useTableOrder } from "@/context/TableOrderContext"
import { useOrder } from "@/hooks/useOrder"
import { useSockJS } from "@/hooks/useSockJS"
import { Product } from "@/models/product"
import { WSSendMessageItems, WSSendMessagePayload } from "@/models/websocket"
import { restaurantState } from "@/store/restaurant"
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { v4 as uuidv4 } from "uuid"

const TOGGLE_OPTIONS: number[] = [0, 0.05, 0.1, 0.15, 0.2]

type SockJSConnection = {
    isConnected: boolean
    sendMessage: (destination: string, body: any) => void
    isSubscribed: boolean
}

export default function OrderPage() {
    const { order, setPrice, price, increment, decrement, clearOrder, updateOrder, attachSessionID, toggleSelect } = useOrder()
    const inputRef = useRef<HTMLInputElement>(null)
    const [tip, setTip] = useState(0)
    const [inputTip, setInputTip] = useState<boolean>(false)
    const [splitBill, setSplitBill] = useState(false)
    const [restaurantInfo] = useRecoilState(restaurantState)
    const [openDialog, setOpenDialog] = useState(false)
    const [shouldSubscribe, setShouldSubscribe] = useState(false)
    const { tableOrder } = useTableOrder()

    const topic = shouldSubscribe && tableOrder && order?.transactionSessionId ? `/topic/transactions/${order.transactionSessionId}` : null
    // /topic/transactions/sessionId
    // /topic/orders/order.orderId
    const socketOrders = useSockJS({
        url: `${API_BASE_URL}/ws`,
        topic: tableOrder ? `/topic/orders/${order.orderId}` : null,
        onMessage: (e) => {
            console.log(e)
            if (e.id) {
                updateOrder(e)
            }
        },
    })

    const socket = useSockJS({
        url: `${API_BASE_URL}/ws`,
        topic: topic,
        onMessage: (e) => {
            if (e.id) {
                updateOrder(e)
            }

            if (e.paymentLink && order.transactionSessionId) {
                window.location.href = e.paymentLink
            }
        },
    })

    useEffect(() => {
        if (!tableOrder) {
            clearOrder()
        }

        if (tableOrder?.status === "ORDERED") {
            console.log("update")
            updateOrder(tableOrder)
        }
    }, [tableOrder])

    const initPayment = useCallback(() => {
        if (!order?.orderId || !order.orderItems.length || !tableOrder) return

        const selected: Product[] = order.orderItems.filter((item) => item.isSelected)
        console.log(selected, order.remainingItems)

        const transactionItems: WSSendMessageItems[] = selected.map((c, _index) => ({
            orderItemId: c?.orderItemId,
            quantity: c.tempQuantity,
        }))

        if (!order.transactionSessionId) {
            attachSessionID(uuidv4())
        }

        setShouldSubscribe(true)

        const payload: WSSendMessagePayload = {
            transactionItems,
            totalPrice: price,
            itemsPrice: price,
            tip,
            orderId: order.orderId,
            sessionId: order.transactionSessionId,
        }

        if (socket.isConnected && socket.isSubscribed) {
            socket.sendMessage("/app/createTransaction", {
                ...payload,
            })
        } else {
            console.log("No connection to socket!")
        }
    }, [socket.isConnected, tableOrder, socket.isSubscribed, order])

    useEffect(() => {
        const selectedTotal = order.orderItems
            .filter((item) => item.isSelected)
            .reduce((sum, item) => sum + item.price * item.tempQuantity, 0)

        const finalPrice = !inputTip ? tip * selectedTotal + selectedTotal : tip + selectedTotal

        setPrice(finalPrice)
    }, [tip, inputTip, order.orderItems])

    const isPaymentDisabled = useMemo(() => {
        if (!order) return true
        if (order?.orderItems?.length < 1) return true
        if (order?.orderItems?.every((item) => item.isSelected === false)) return true
        if (order.paid) return true
        if (price <= 0) return true
        return false
    }, [order, price])

    return (
        <Container title={""}>
            <DialogPopUp
                title='Сигурни ли сте, че искате да платите?'
                description='Това ще инициализира поръчка.'
                defaultTitle='Да'
                cancelTitle='Не'
                isOpen={openDialog}
                onConfirm={() => {
                    initPayment()
                    setOpenDialog(false)
                }}
                onCancel={() => setOpenDialog(false)}
                shouldConfirm
            />
            <ScrollArea className='calc-height min-w-full p-4'>
                {order.orderItems &&
                    order.orderItems.length &&
                    order.orderItems.map((item, index) => (
                        <CardContainer
                            productId={item.id}
                            classNames='mb-6 mx-auto bg-lightBg'
                            isWine={false}
                            key={`${item.id}-container`}
                            isBlocked
                            image={item.image}
                        >
                            <PaymentProduct
                                id={item.id}
                                name={item.name ?? ""}
                                tempQuantity={item?.tempQuantity ?? ""}
                                quantity={item.quantity ?? ""}
                                description={item.description ?? ""}
                                price={item.price ?? ""}
                                splitBill={splitBill}
                                increment={increment}
                                decrement={decrement}
                                checked={item.isSelected}
                                onCheckboxToggle={() => toggleSelect(item.id)}
                            />
                        </CardContainer>
                    ))}
            </ScrollArea>
            <div className='mb-2 flex w-full flex-col gap-2 border-t border-lightBg p-4'>
                <h2 className='text-base font-medium text-white'>Комплимент за сервитьора</h2>
                <div className='flex flex-1 justify-between gap-1'>
                    {TOGGLE_OPTIONS.map((option, index) => (
                        <div
                            className='mb-4 flex w-full'
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
                                className={`h-12 w-16 bg-lightBg text-base text-white data-[state=on]:bg-yellow data-[state=on]:text-white`}
                            >
                                {option * 100 + "%"}
                            </Toggle>
                        </div>
                    ))}
                </div>
                <label className='relative'>
                    <Input
                        ref={inputRef}
                        type='number'
                        className='border-2 border-lightBg text-base text-white'
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
                    <span className='absolute right-0 top-0 flex h-12 w-12 items-center justify-center rounded-r-2xl border-2 border-lightBg bg-lighterGray text-center text-white'>
                        лв
                    </span>
                </label>
            </div>
            <div className='flex w-full gap-4 p-4'>
                <Button
                    className='w-full gap-2 bg-lightBg py-6 text-base font-medium transition-transform ease-in-out active:scale-75'
                    type='button'
                    id='add'
                    variant='select'
                    onClick={() => setSplitBill((prev) => !prev)}
                >
                    {splitBill ? "Назад" : "Раздели и плати"}{" "}
                </Button>
                <Button
                    onClick={() => {
                        setOpenDialog(true)
                    }}
                    disabled={isPaymentDisabled}
                    className='w-full gap-2 py-6 text-base font-medium text-lightBg transition-transform ease-in-out active:scale-75'
                    type='button'
                    id='add'
                    variant='select'
                >
                    Плати {price.toFixed(2)} лв
                </Button>
            </div>
        </Container>
    )
}
