"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Product } from "@/models/product"
import Image from "next/image"
import { LegacyRef, forwardRef } from "react"

interface ProductCardProps {
    itemData: Product
    classNames?: string
    isWine: boolean
    children?: React.ReactNode
}

const CardContainer = ({ itemData, classNames, isWine, children }: ProductCardProps, ref: LegacyRef<HTMLDivElement> | undefined) => {
    if (!itemData) return null

    return (
        <Card
            ref={ref}
            className={`flex flex-col justify-center rounded-2xl border-0 bg-lightBg ${classNames}`}
        >
            <CardContent className='flex w-full rounded-lg p-0'>
                <Image
                    src='/images/pizza.png'
                    width={96}
                    height={96}
                    className='h-24 w-24 rounded-s-2xl'
                    alt='Img'
                />
                <div className='p2 flex flex-1 flex-row items-center justify-between gap-4 px-4'>{children}</div>
            </CardContent>
        </Card>
    )
}

export default forwardRef(CardContainer)
