"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { OrderProductProps } from "@/models/product"
import IconMinus from "../../../public/svg/icons/IconMinus"
import IconPlus from "../../../public/svg/icons/IconPlus"

const ProductCard = ({ children, id, price, quantity, tempQuantity, classNames, decrement, increment }: OrderProductProps) => {
    return (
        <Card
            className={`relative flex w-[85%] flex-col justify-center border-[1px] border-defaultGray bg-black bg-transparent bg-opacity-55 ${classNames}`}
        >
            <CardContent className='flex w-full flex-row items-center rounded-lg border-none p-2'>{children}</CardContent>
            <CardFooter className='mx-auto w-[90%] items-center justify-between gap-2 border-t-[1px] border-defaultGray pt-2'>
                <div className='flex h-10 w-full flex-1 items-center justify-around gap-2 rounded-lg bg-white p-1 px-4 text-lg'>
                    <div
                        className='cursor-pointer rounded-full bg-yellow p-1'
                        onClick={() => decrement && decrement(id, quantity)}
                    >
                        <IconMinus color='black' />
                    </div>
                    {tempQuantity ? tempQuantity : quantity}
                    <div
                        className='cursor-pointer rounded-full bg-yellow p-1'
                        onClick={() => increment && increment(id, quantity)}
                    >
                        <IconPlus color='black' />
                    </div>
                </div>
                <Button
                    disabled
                    className='w-full flex-1 gap-2 text-lg'
                    type='button'
                    id='price'
                    variant='default'
                >
                    {price}лв
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ProductCard
