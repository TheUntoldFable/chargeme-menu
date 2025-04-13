"use client"

import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useOrder } from "@/hooks/useOrder"
import Image from "next/image"
import { useEffect, useState } from "react"

import DialogPopUp from "@/components/common/DialogPopUp"
import IconFailed from "../../../public/svg/icons/IconFailed"
import IconSuccess from "../../../public/svg/icons/IconSuccess"

import appleLogo from "@/../public/svg/logos/apple.svg"
import mastercardLogo from "@/../public/svg/logos/mastercard.svg"
import visaLogo from "@/../public/svg/logos/visa.svg"
import { ScrollArea } from "@/components/ui/scroll-area"
import useWebSocket from "react-use-websocket"

const SOCKET_URL = "/topic/orders/"

export default function PaymentPage() {
    const [isSuccessful, setIsSuccessfull] = useState<boolean>(false)
    const [isUnSuccessful, setIsUnsuccessful] = useState<boolean>(false)
    const { price, order } = useOrder()
    const [paymentMethod, setPaymentMethod] = useState("card")
    const isDisabled = order.orderItems.length <= 0 || price <= 0

    const { lastMessage, lastJsonMessage } = useWebSocket(SOCKET_URL, {
        onOpen: () => console.log("opened"),
        // Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: () => true,
    })

    useEffect(() => {
        if (lastMessage !== null) {
            console.log(`Last Message: ${lastJsonMessage}`)
        }
    }, [lastMessage])

    return (
        <Container title={""}>
            <ScrollArea className='h-screen min-w-full p-4'>
                <DialogPopUp
                    icon={<IconSuccess />}
                    title='Успешно плащане!'
                    description='Благодарим Ви, че избрахте нас, очакваме ви отново скоро!'
                    buttonTitle='Ok'
                    isOpen={isSuccessful}
                    onPress={() => setIsSuccessfull(false)}
                />
                <DialogPopUp
                    icon={<IconFailed />}
                    title='Неуспешно плащане!'
                    description='Възникна грешка по време на плащането, моля опитайте пак.'
                    buttonTitle='Оптиай пак'
                    isOpen={isUnSuccessful}
                    onPress={() => setIsUnsuccessful(false)}
                />
                <div className='mt-2 flex h-screen w-full flex-1 flex-col gap-2 px-4'>
                    <Button variant='default'>
                        <div className='flex items-center gap-1'>
                            <Image
                                width={20}
                                src={appleLogo}
                                alt='appleLogo'
                            />
                            <p>Pay</p>
                        </div>
                    </Button>
                    <div className='flex flex-row items-center justify-between gap-2'>
                        <div className='h-[1px] w-full bg-lightGray' />
                        <p className='text-lightGray'>или</p>
                        <div className='h-[1px] w-full bg-lightGray' />
                    </div>
                    <h3>Изберете начин на плащане:</h3>
                    <RadioGroup
                        className='text-lightGray'
                        defaultValue='option-one'
                    >
                        <div
                            onClick={() => setPaymentMethod("card")}
                            className='flex items-center justify-between space-x-2 rounded-xl bg-lightBg px-2 py-4'
                        >
                            <RadioGroupItem
                                checked={paymentMethod === "card"}
                                className='text-yellow'
                                value='card'
                                id='option-card'
                            />
                            <Label htmlFor='option-one'>Кредитна / Дебитна карта</Label>
                            <div className='flex items-center gap-2'>
                                <Image
                                    width={40}
                                    src={mastercardLogo}
                                    alt='mastercardLogo'
                                />
                                <Image
                                    width={40}
                                    src={visaLogo}
                                    alt='visaLogo'
                                />
                            </div>
                        </div>
                        <div
                            onClick={() => setPaymentMethod("pos")}
                            className='flex items-center space-x-2 rounded-xl bg-lightBg px-2 py-4'
                        >
                            <RadioGroupItem
                                checked={paymentMethod === "pos"}
                                className='text-yellow'
                                value='pos'
                                id='option-pos'
                            />
                            <Label htmlFor='option-one'>POS терминал</Label>
                        </div>
                        <div
                            onClick={() => setPaymentMethod("cash")}
                            className='flex items-center space-x-2 rounded-xl bg-lightBg px-2 py-4'
                        >
                            <RadioGroupItem
                                checked={paymentMethod === "cash"}
                                className='text-yellow'
                                value='cash'
                                id='option-cash'
                            />
                            <Label htmlFor='option-one'>В брой</Label>
                        </div>
                    </RadioGroup>
                    <Button
                        onClick={() => {
                            if (paymentMethod === "card") {
                                setIsSuccessfull(true)
                            }
                            if (paymentMethod !== "card") {
                                setIsUnsuccessful(true)
                            }
                        }}
                        className='mb-0 mt-auto'
                        variant='select'
                    >
                        <p className='text-darkBg'>Плати {price.toFixed(2)} BGN</p>
                    </Button>
                </div>
            </ScrollArea>
        </Container>
    )
}
