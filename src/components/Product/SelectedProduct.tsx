"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import IconMinus from "../../../public/svg/IconMinus"
import IconPlus from "../../../public/svg/IconPlus"

interface ProductCardProps {
    id: string | number
    price: number
    quantity: number
    tempQuantity?: number
    classNames?: string
    decrement: (id: string | number, quantity: number) => void
    increment: (id: string | number, quantity: number) => void
    children: React.ReactNode
}

const ProductCard = ({ children, id, price, quantity, tempQuantity, classNames, decrement, increment }: ProductCardProps) => {
    return (
        <Card
            className={`
     flex-col
     bg-transparent
     relative
     w-[85%]
     border-defaultGray
     border-[1px]
     flex
     bg-black bg-opacity-55
     justify-center ${classNames}`}
        >
            <CardContent className='flex flex-row items-center p-2 w-full rounded-lg border-none'>{children}</CardContent>
            <CardFooter
                className='
        pt-2
       w-[90%]
      items-center
      justify-between
      gap-2
      mx-auto
      border-t-[1px]
      border-defaultGray'
            >
                <div
                    className=' bg-white rounded-lg p-1 flex flex-1
          w-full
          h-10
          px-4
          items-center
          justify-around
          text-lg gap-2
          text-black
          '
                >
                    <div
                        className='bg-yellow rounded-full p-1 cursor-pointer'
                        onClick={() => decrement(id, quantity)}
                    >
                        <IconMinus color='black' />
                    </div>
                    {tempQuantity ? tempQuantity : quantity}
                    <div
                        className='bg-yellow rounded-full p-1 cursor-pointer'
                        onClick={() => increment(id, quantity)}
                    >
                        <IconPlus color='black' />
                    </div>
                </div>
                <Button
                    disabled
                    className='flex-1 w-full text-lg gap-2'
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
