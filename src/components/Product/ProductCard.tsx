"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Product } from "@/models/product"
import { cartState } from "@/store/cart"
import Image from "next/image"
import { LegacyRef, forwardRef } from "react"
import { useRecoilState } from "recoil"
import Circle from "../../../public/svg/Circle"
import IconMinus from "../../../public/svg/IconMinus"
import IconPlus from "../../../public/svg/IconPlus"

interface ProductCardProps {
    badge?: string
    itemData: Product
    classNames?: string
    isWine: boolean
}

const ProductCard = ({ badge, itemData, classNames, isWine }: ProductCardProps, ref: LegacyRef<HTMLDivElement> | undefined) => {
    const { toast } = useToast()
    const [cartItems, setCartItems] = useRecoilState(cartState)
    if (!itemData) return null

    const { desc, title, type, price, weight, id } = itemData

    const isInCart = cartItems.find((c) => c.id === id)

    const handleRemoveFromCart = () => {
        const filteredItems = cartItems.filter((i) => i.id !== id)
        setCartItems(filteredItems)
        toast({
            variant: "destructive",
            title: "Премахване от количка",
            description: `Продуктът ${title} е успешно премахнат от вашата количка!`,
        })
    }

    const handleAddToCart = () => {
        setCartItems([...cartItems, { ...itemData, isSelected: true, quantity: 1 }])
        toast({
            variant: "default",
            title: "Добавяне в количка",
            description: `Продуктът ${title} е успешно добавен във вашата количка!`,
        })
    }

    return (
        <Card
            ref={ref}
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
            {badge && (
                <CardHeader
                    className='
      z-10
      text-xl
      absolute
      bg-red
      items-center
      -top-6
      py-2
      px-6
      rounded-xl'
                >
                    <p className='font-bold'>{badge ?? "Test"}</p>
                </CardHeader>
            )}
            <CardContent className='p-0 w-full rounded-lg border-none'>
                <Image
                    src='/images/pizza.png'
                    width={300}
                    height={200}
                    className='flex flex-1 w-full mb-4'
                    alt='Img'
                />
                <div className='flex flex-1 flex-col gap-4 px-4 mb-4 justify-between'>
                    <h1>{title}</h1>
                    <p>{desc}</p>
                    <div className='flex flex-row justify-between gap-1'>
                        <div className='flex gap-2'>
                            {[...Array(3)].map((_i, index) => (
                                <Circle
                                    key={index}
                                    color={type === "yellow" ? "#EDDB75" : undefined}
                                />
                            ))}
                        </div>
                        <div className='flex gap-2'>
                            <p>{weight}гр.</p>
                            <p className='font-bold'>{price}лв</p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter
                className='
        pt-2
       w-[90%]
      items-center
      justify-center
      mx-auto
      border-t-[1px]
      border-defaultGray'
            >
                <Button
                    className={`w-[60%] text-lg gap-2 ${isWine ? "bg-wine-default text-white border-wine-border-btn border-[1px]" : "text-black"}`}
                    type='button'
                    id='add'
                    variant={isInCart ? "destructive" : "default"}
                    onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
                >
                    {isInCart ? <IconMinus color={isWine ? "#fff" : "#000"} /> : <IconPlus color={isWine ? "#fff" : "#000"} />}
                    {isInCart ? "Премахни" : "Добави"}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default forwardRef(ProductCard)
