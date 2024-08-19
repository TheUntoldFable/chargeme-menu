"use client"

import CartProduct from "@/components/Product/CartProduct"
import SelectedProduct from "@/components/Product/SelectedProduct"
import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import TotalPrice from "@/components/ui/total-price"
import { calculateTotalPrice } from "@/lib/utils"
import { orderState } from "@/store/order"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"

export default function Cart() {
    const orderItems = useRecoilValue(orderState)
    const [tempQuantity, setTempQuantity] = useState<{ [key: string]: number }>({})

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
            />
            <Link
                className='w-full flex items-center justify-center'
                href={{
                    pathname: "/payment",
                    query: {
                        totalAmount: calculateTotalPrice(orderItems, true),
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
