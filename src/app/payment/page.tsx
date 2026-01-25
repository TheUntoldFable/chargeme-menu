"use client"

import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useOrder } from "@/hooks/useOrder"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect, useState } from "react"

import IconFailed from "#/public/svg/icons/IconFailed"
import IconSuccess from "#/public/svg/icons/IconSuccess"
import { DialogPopUp } from "@/components/common/DialogPopUp"

import appleLogo from "#/public/svg/logos/apple.svg"
import mastercardLogo from "#/public/svg/logos/mastercard.svg"
import visaLogo from "#/public/svg/logos/visa.svg"
import useWebSocket from "react-use-websocket"

const SOCKET_URL = "/topic/orders/"

export default function PaymentPage() {
    const [isSuccessful, setIsSuccessfull] = useState<boolean>(false)
    const [isUnSuccessful, setIsUnsuccessful] = useState<boolean>(false)
    const { priceInBgn } = useOrder()
    const tPayment = useTranslations("payment")
    const tCommon = useTranslations("common")
    const [paymentMethod, setPaymentMethod] = useState("card")

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
            <DialogPopUp
                icon={<IconSuccess />}
                title={tPayment("success.title")}
                description={tPayment("success.description")}
                defaultTitle={tCommon("ok")}
                isOpen={isSuccessful}
                onConfirm={() => setIsSuccessfull(false)}
            />
            <DialogPopUp
                icon={<IconFailed />}
                title={tPayment("failed.title")}
                description={tPayment("failed.description")}
                defaultTitle={tCommon("ok")}
                isOpen={isUnSuccessful}
                onConfirm={() => setIsUnsuccessful(false)}
            />
            <div className='mt-2 flex w-full flex-1 flex-col gap-2 px-4'>
                <Button variant='default'>
                    <div className='flex items-center gap-1'>
                        <Image
                            width={20}
                            src={appleLogo}
                            alt='appleLogo'
                        />
                        <p>{tCommon("pay")}</p>
                    </div>
                </Button>
                <div className='flex flex-row items-center justify-between gap-2'>
                    <div className='bg-lightGray h-px w-full' />
                    <p className='text-lightGray'>{tCommon("or")}</p>
                    <div className='bg-lightGray h-px w-full' />
                </div>
                <h3>{tPayment("chooseMethod")}</h3>
                <RadioGroup
                    className='text-lightGray'
                    defaultValue='option-one'
                >
                    <div
                        onClick={() => setPaymentMethod("card")}
                        className='bg-lightBg flex items-center justify-between space-x-2 rounded-xl px-2 py-4'
                    >
                        <RadioGroupItem
                            checked={paymentMethod === "card"}
                            className='text-yellow'
                            value='card'
                            id='option-card'
                        />
                        <Label htmlFor='option-one'>{tPayment("methods.card")}</Label>
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
                        className='bg-lightBg flex items-center space-x-2 rounded-xl px-2 py-4'
                    >
                        <RadioGroupItem
                            checked={paymentMethod === "pos"}
                            className='text-yellow'
                            value='pos'
                            id='option-pos'
                        />
                        <Label htmlFor='option-one'>{tPayment("methods.pos")}</Label>
                    </div>
                    <div
                        onClick={() => setPaymentMethod("cash")}
                        className='bg-lightBg flex items-center space-x-2 rounded-xl px-2 py-4'
                    >
                        <RadioGroupItem
                            checked={paymentMethod === "cash"}
                            className='text-yellow'
                            value='cash'
                            id='option-cash'
                        />
                        <Label htmlFor='option-one'>{tPayment("methods.cash")}</Label>
                    </div>
                </RadioGroup>
            </div>
            <Button
                onClick={() => {
                    if (paymentMethod === "card") {
                        setIsSuccessfull(true)
                    }
                    if (paymentMethod !== "card") {
                        setIsUnsuccessful(true)
                    }
                }}
                className='mt-auto mb-10'
                variant='select'
            >
                <p className='text-darkBg'>
                    {tCommon("pay")} {priceInBgn.toFixed(2)} {tCommon("currency")}
                </p>
            </Button>
        </Container>
    )
}
