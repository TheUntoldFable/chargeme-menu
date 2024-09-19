"use client"

import CartProduct from "@/components/Product/CartProduct"
import SelectedProduct from "@/components/Product/SelectedProduct"
import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import TotalPrice from "@/components/ui/total-price"
import { calculateTotalPrice } from "@/lib/utils"
import { orderState } from "@/store/order"
import Link from "next/link"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useRecoilValue } from "recoil"

const TOGGLE_OPTIONS: number[] = [0, 0.05, 0.1, 0.15, 0.2]

export default function Cart() {
    const orderItems = useRecoilValue(orderState)
    const inputRef = useRef(null)
    const [tempQuantity, setTempQuantity] = useState<{ [key: string]: number }>({})

    const [tip, setTip] = useState(0)
    const [percentage, setPercentage] = useState<boolean>(false)

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
        const mappedQuantityById: { [key: string]: number } = {}
        orderItems.forEach((item) => {
            mappedQuantityById[item.id] = item.quantity
        })
        setTempQuantity(mappedQuantityById)
    }, [])

    return (
        <Container title='Плащане'>
            <ScrollArea className='h-screen min-w-full'>
                {orderItems.map((item, index) => (
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
                items={orderItems}
                withSelection={true}
                tempQuantity={tempQuantity}
                tip={tip}
                percentage={percentage}
            />
            <div className='flex flex-col mb-2 gap-2'>
                <h2 className='text-white'>Добавете бакшиш?</h2>
                <div className='flex flex-1 justify-between'>
                    {TOGGLE_OPTIONS.map((option, index) => (
                        <div
                            className='flex'
                            key={option}
                        >
                            <Toggle
                                pressed={tip === option && tip !== undefined}
                                onClick={() => {
                                    setPercentage(true)
                                    setTip(option)

                                    if (inputRef.current && inputRef.current?.value) {
                                        inputRef.current.value = ""
                                    }
                                }}
                                className={`border-[2px] bg-white data-[state=on]:bg-yellow data-[state=on]:text-white border-yellow`}
                            >
                                {option * 100 + "%"}
                            </Toggle>
                            {index < 4 && (
                                <Separator
                                    className='mx-1'
                                    orientation='vertical'
                                />
                            )}
                        </div>
                    ))}
                </div>
                <Input
                    ref={inputRef}
                    type='number'
                    placeholder='Въведете сума'
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setPercentage(false)
                        if (e?.target?.value) {
                            setTip(Number(e.target.value))
                        }

                        if (e.target.value === "") {
                            setTip(0)
                        }
                    }}
                />
            </div>
            <Link
                className='w-full flex items-center justify-center'
                href={{
                    pathname: "/payment",
                    query: {
                        totalAmount: percentage
                            ? (tip * Number(calculateTotalPrice(orderItems, true)) + Number(calculateTotalPrice(orderItems, true))).toFixed(
                                  2
                              )
                            : (tip + Number(calculateTotalPrice(orderItems, true))).toFixed(2),
                    },
                }}
            >
                <Button
                    disabled={!orderItems || orderItems.length < 1}
                    className='w-[60%]
           text-lg
           gap-2
           mb-4
           active:scale-75
           transition-transform
           ease-in-out'
                    type='button'
                    id='add'
                    variant='secondary'
                >
                    Плати
                </Button>
            </Link>
        </Container>
    )
}
