"use client"

import { API_BASE_URL } from "@/api/config"
import CardContainer from "@/components/Product/CardContainer"
import PaymentProduct from "@/components/Product/PaymentProduct"
import Center from "@/components/common/Center"
import DialogPopUp from "@/components/common/DialogPopUp"
import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toggle } from "@/components/ui/toggle"
import { useGetAllOrders } from "@/hooks/send-payment-data"
import { useOrder } from "@/hooks/useOrder"
import { useSockJS } from "@/hooks/useSockJS"
import { Product } from "@/models/product"
import { WSSendMessageItems, WSSendMessagePayload } from "@/models/websocket"
import { restaurantState } from "@/store/restaurant"
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil"

const TOGGLE_OPTIONS: number[] = [0, 0.05, 0.1, 0.15, 0.2]

export default function OrderPage() {
    const { order, setPrice, price, increment, decrement, clearOrder } = useOrder()
    const inputRef = useRef<HTMLInputElement>(null)
    const [tip, setTip] = useState(0)
    const [inputTip, setInputTip] = useState<boolean>(false)
    const [splitBill, setSplitBill] = useState(false)
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({})
    const [restaurantInfo] = useRecoilState(restaurantState)
    const [openDialog, setOpenDialog] = useState(false)

    const { data: tableOrder, isLoading, refetch } = useGetAllOrders(restaurantInfo)

    const socket = useSockJS({
        url: `${API_BASE_URL}/ws`,
        topic: tableOrder ? `/topic/orders/${tableOrder.id}` : null,
        onMessage: (e) => {
            if (!e.irisPaymentLink) return
            window.location.href = e.irisPaymentLink
        },
    })

    useEffect(() => {
        if (!tableOrder && !isLoading) {
            clearOrder()
        }
    }, [tableOrder, isLoading])

    const initPayment = useCallback(() => {
        if (!order?.orderId || !order.orderItems.length || !tableOrder) return

        const selected: Product[] = order.orderItems.filter((item) => selectedItems[item.id])

        const transactionItems: WSSendMessageItems[] = selected.map((c, index) => ({
            orderItemId: tableOrder.orderItems[index].orderItemId,
            quantity: c.quantity,
        }))

        const payload: WSSendMessagePayload = {
            transactionItems,
            totalPrice: price,
            itemsPrice: price,
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
    }, [socket.isConnected, tableOrder, socket.isSubscribed, selectedItems, order.orderItems])

    useEffect(() => {
        const selectedTotal = order.orderItems
            .filter((item) => selectedItems[item.id])
            .reduce((sum, item) => sum + item.price * item.quantity, 0)

        const finalPrice = !inputTip ? tip * selectedTotal + selectedTotal : tip + selectedTotal

        setPrice(finalPrice)
    }, [tip, inputTip, order.orderItems, selectedItems])

    useEffect(() => {
        const initialCheckboxState: { [key: string]: boolean } = {}
        order.orderItems.forEach((item) => {
            initialCheckboxState[item.id] = true
        })
        setSelectedItems(initialCheckboxState)
    }, [])

    const toggleCheckbox = (id: string | number) => {
        setSelectedItems((prevState) => {
            const updatedState = {
                ...prevState,
                [id]: !prevState[id],
            }
            updatePrice(updatedState)
            return updatedState
        })
    }

    const updatePrice = (checkboxState: { [key: string]: boolean }) => {
        const selectedTotal = order.orderItems
            .filter((item) => checkboxState[item.id])
            .reduce((sum, item) => sum + item.price * item.quantity, 0)

        setPrice(!inputTip ? tip * selectedTotal + selectedTotal : tip + selectedTotal)
    }

    if (!order.orderItems?.length || isLoading)
        return (
            <Container title=''>
                <Center>
                    <Loader />
                </Center>
            </Container>
        )

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
                            productId={item.id.toString()}
                            classNames='mb-6 mx-auto bg-lightBg'
                            isWine={false}
                            key={`${item.id}-container`}
                            isBlocked={true}
                        >
                            <PaymentProduct
                                splitBill={splitBill}
                                increment={increment}
                                decrement={decrement}
                                {...item}
                                checked={selectedItems[item.id]}
                                onCheckboxToggle={() => toggleCheckbox(item.id)}
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
                    disabled={!order || order?.orderItems?.length < 1 || order?.orderItems?.every((item) => item.isSelected === false)}
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
