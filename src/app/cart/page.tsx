"use client"

import CardContainer from "@/components/Product/CardContainer"
import OrderProduct from "@/components/Product/OrderProduct"
import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toggle } from "@/components/ui/toggle"
import { useOrder } from "@/hooks/useOrder"
import { calculateTotalPrice } from "@/lib/utils"
import Link from "next/link"
import { ChangeEvent, useEffect, useRef, useState } from "react"

const TOGGLE_OPTIONS: number[] = [0, 0.05, 0.1, 0.15, 0.2]

export default function Cart() {
    const { orderItems, setPrice, price } = useOrder()
    const inputRef = useRef<HTMLInputElement>(null)
    const [tempQuantity, setTempQuantity] = useState<{ [key: string]: number }>({})
    const [tip, setTip] = useState(0)
    const [inputTip, setInputTip] = useState<boolean>(false)

    useEffect(() => {
        setPrice(
            !inputTip
                ? tip * Number(calculateTotalPrice(orderItems, true)) + Number(calculateTotalPrice(orderItems, true))
                : tip + Number(calculateTotalPrice(orderItems, true))
        )
    }, [tip, inputTip, orderItems])

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
        <Container title={""}>
            <ScrollArea className='h-screen min-w-full p-4'>
                {orderItems.map((item, index) => (
                    <CardContainer
                        productId={item.id.toString()}
                        classNames='mb-6 mx-auto bg-lightBg'
                        isWine={false}
                        key={`${item.id}-container`}
                    >
                        <OrderProduct
                            children={undefined}
                            {...item}
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
                <Link
                    className='flex w-full items-center justify-center'
                    href={{
                        pathname: "/payment",
                        query: {
                            totalAmount: price,
                        },
                    }}
                >
                    <Button
                        disabled={!orderItems || orderItems.length < 1}
                        className='w-full gap-2 bg-lightBg py-6 text-base font-medium transition-transform ease-in-out active:scale-75'
                        type='button'
                        id='add'
                        variant='select'
                    >
                        Радели и плати
                    </Button>
                </Link>
                <Link
                    className='flex w-full items-center justify-center'
                    href={{
                        pathname: "/payment",
                        query: {
                            totalAmount: price,
                        },
                    }}
                >
                    <Button
                        disabled={!orderItems || orderItems.length < 1}
                        className='w-full gap-2 py-6 text-base font-medium text-lightBg transition-transform ease-in-out active:scale-75'
                        type='button'
                        id='add'
                        variant='select'
                    >
                        Плати {price} лв
                    </Button>
                </Link>
            </div>
        </Container>
    )
}
