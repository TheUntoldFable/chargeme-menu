"use client"
import { API_BASE_URL } from "@/api/config"
import TipDialog, { calculateItemsPrice, calculateTipForOrder } from "@/components/Payment/TipPopUp"
import CardContainer from "@/components/Product/CardContainer"
import PaymentProduct from "@/components/Product/PaymentProduct"
import DialogPopUp from "@/components/common/DialogPopUp"
import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTableOrder } from "@/context/TableOrderContext"
import { useTranslations } from "next-intl"
import { useOrder } from "@/hooks/useOrder"
import { useSockJS } from "@/hooks/useSockJS"
import { calculateTotalPriceEur } from "@/lib/utils"
import { Product } from "@/models/product"
import { WSSendMessageItems, WSSendMessagePayload } from "@/models/websocket"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"

export default function OrderPage() {
    const { order, setPrice, price, increment, decrement, clearOrder, updateOrder, attachSessionID, toggleSelect } = useOrder()
    const tOrder = useTranslations("order")
    const tCommon = useTranslations("common")
    const inputRef = useRef<HTMLInputElement>(null)
    const [tip, setTip] = useState(0)
    const [inputTip, setInputTip] = useState<boolean>(false)
    const [splitBill, setSplitBill] = useState(false)
    const [tipDialogOpen, setTipDialogOpen] = useState(false)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const { tableOrder } = useTableOrder()

    const [topic, setTopic] = useState(order ? `/topic/orders/${order.orderId}` : null)

    const socket = useSockJS({
        url: `${API_BASE_URL}/ws`,
        topic: topic,
        onMessage: (e) => {
            if (e.id) {
                updateOrder(e)
            }

            if (order.transactionSessionId && e.paymentLink) {
                window.location.href = e.paymentLink
            }
        },
    })

    useEffect(() => {
        if (!tableOrder) {
            clearOrder()
        }

        if (tableOrder?.status === "ORDERED") {
            updateOrder(tableOrder)
        }
    }, [tableOrder])

    const handleConfirmTip = () => {
        //Subscribe to transaction topic
        const sessionId = uuidv4()
        attachSessionID(sessionId)
        setTopic(`/topic/transactions/${sessionId}`)
        setConfirmDialogOpen(true)
    }

    const handleCancelDialog = () => {
        //Revert back to old topic
        setTopic(`/topic/orders/${order.orderId}`)
        setConfirmDialogOpen(false)
    }

    const initPayment = useCallback(() => {
        if (!order?.orderId || !order.orderItems.length || !tableOrder) return

        const selected: Product[] = order.orderItems.filter((item) => item.isSelected)

        const transactionItems: WSSendMessageItems[] = selected.map((c, _index) => ({
            orderItemId: c?.orderItemId,
            quantity: c.tempQuantity,
        }))

        const payload: WSSendMessagePayload = {
            transactionItems,
            totalPrice: price,
            itemsPrice: Number(calculateItemsPrice(price, tip, inputTip).toFixed(2)),
            tip: Number(calculateTipForOrder(price, tip, inputTip).toFixed(2)),
            orderId: order.orderId,
            sessionId: order.transactionSessionId,
        }

        if (socket.isConnected && socket.isSubscribed && order.transactionSessionId) {
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

    // Calculate base price without tip for the tip dialog
    const basePriceWithoutTip = order.orderItems
        .filter((item) => item.isSelected)
        .reduce((sum, item) => sum + item.price * item.tempQuantity, 0)

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
                                tempQuantity={item?.tempQuantity ?? 0}
                                quantity={item.quantity ?? 0}
                                description={item.description ?? ""}
                                price={item.price ?? 0}
                                splitBill={splitBill}
                                increment={increment}
                                decrement={decrement}
                                checked={item.isSelected}
                                onCheckboxToggle={() => toggleSelect(item.id)}
                            />
                        </CardContainer>
                    ))}
            </ScrollArea>
            <TipDialog
                open={tipDialogOpen}
                onOpenChange={setTipDialogOpen}
                onConfirm={handleConfirmTip}
                tip={tip}
                setTip={setTip}
                setInputTip={setInputTip}
                inputRef={inputRef}
                basePrice={basePriceWithoutTip}
                orderItems={order?.orderItems || []}
            />
            <DialogPopUp
                isOpen={confirmDialogOpen}
                onConfirm={initPayment}
                onCancel={handleCancelDialog}
                title={tOrder("confirmPayment.title")}
                description={tOrder("confirmPayment.description")}
                defaultTitle={tCommon("yes")}
                cancelTitle={tCommon("no")}
                shouldConfirm
            />
            <div className='w-full gap-4 p-4'>
                <Button
                    className='mb-4 w-full gap-2 bg-lightBg py-6 text-base font-medium transition-transform ease-in-out active:scale-75'
                    type='button'
                    id='add'
                    variant='select'
                    onClick={() => setSplitBill((prev) => !prev)}
                >
                    {splitBill ? tCommon("back") : tOrder("splitAndPay")}{" "}
                </Button>
                <Button
                    onClick={() => {
                        handleConfirmTip()
                    }}
                    disabled={isPaymentDisabled}
                    className='w-full gap-2 py-6 text-base font-medium text-lightBg transition-transform ease-in-out active:scale-75'
                    type='button'
                    id='add'
                    variant='select'
                >
                    {tCommon("pay")} {price ? price.toFixed(2) : 0} {tCommon("currency")}{" "}
                    {order?.orderItems && (
                        <span className='text-gray'>/ €{calculateTotalPriceEur(order.orderItems, false).toFixed(2)}</span>
                    )}
                </Button>
            </div>
        </Container>
    )
}
