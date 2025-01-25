"use client"

import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useOrder } from "@/hooks/useOrder"
import Image from "next/image"
import { useState } from "react"

import DialogPopUp from "@/components/common/DialogPopUp"
import IconFailed from "../../../public/svg/icons/IconFailed"
import IconSuccess from "../../../public/svg/icons/IconSuccess"

import mastercardLogo from "@/../public/svg/logos/mastercard.svg"
import visaLogo from "@/../public/svg/logos/visa.svg"
import { useSendPayment } from "@/hooks/send-payment-data"

export default function PaymentPage() {
    const [isSuccessful, setIsSuccessfull] = useState<boolean>(false)
    const [isUnSuccessful, setIsUnsuccessful] = useState<boolean>(false)
    const { price, orderItems } = useOrder()
    const [paymentMethod, setPaymentMethod] = useState("card")
    const isDisabled = orderItems.length <= 0 || price <= 0
    const { mutateAsync: sendPayment } = useSendPayment()

    return (
        <Container>
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
            <div className='flex flex-1 gap-2 flex-col px-4 mt-2 h-screen w-full'>
                {/*<Button variant='default'>*/}
                {/*    <div className='flex items-center gap-1'>*/}
                {/*        <Image*/}
                {/*            width={20}*/}
                {/*            src={appleLogo}*/}
                {/*            alt='appleLogo'*/}
                {/*        />*/}
                {/*        <p>Pay</p>*/}
                {/*    </div>*/}
                {/*</Button>*/}
                {/*<div className='flex flex-row justify-between gap-2 items-center'>*/}
                {/*    <div className='bg-lightGray h-[1px] w-full' />*/}
                {/*    <p className='text-lightGray'>или</p>*/}
                {/*    <div className='bg-lightGray h-[1px] w-full' />*/}
                {/*</div>*/}
                <h3>Изберете начин на плащане:</h3>
                <RadioGroup
                    className='text-lightGray'
                    defaultValue='option-one'
                >
                    <div
                        onClick={() => setPaymentMethod("card")}
                        className='flex rounded-xl px-2 py-4 bg-lightBg items-center justify-between space-x-2'
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
                        className='flex rounded-xl px-2 py-4 bg-lightBg items-center space-x-2'
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
                        className='flex rounded-xl px-2 py-4 bg-lightBg items-center space-x-2'
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
                {/*               <div className='text-yellow'>
                    <iframe
                        className='h-96 bg-white w-full'
                        ref={iframeRef}
                        src={paymentIframeSrc}
                    ></iframe>
                </div>*/}
                <Button
                    disabled={isDisabled}
                    onClick={async () => {
                        if (paymentMethod === "card") {
                            const returnUrl = await sendPayment(orderItems)
                            window.location.replace(returnUrl)
                            setIsSuccessfull(true)
                        }
                        if (paymentMethod !== "card") {
                            setIsUnsuccessful(true)
                        }
                    }}
                    className='mt-auto mb-0'
                    variant='select'
                >
                    <p className='text-darkBg'>Плати {price.toFixed(2)} BGN</p>
                </Button>
            </div>
        </Container>
    )
}
