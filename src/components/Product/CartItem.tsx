"use client"

import IconPlus from "#/public/svg/icons/IconPlus"
import QuantityControl from "@/components/common/QuantityControl"
import { OrderProductProps } from "@/models/product"
import { cartState } from "@/store/cart"
import React from "react"
import { useRecoilState } from "recoil"
import { toast } from "../ui/use-toast"

const CartItem = ({ name, id, tempQuantity, quantity, description, price, increment, decrement }: OrderProductProps) => {
    const [cartItems, setCartItems] = useRecoilState(cartState)

    const handleRemoveFromCart = (e: React.MouseEvent) => {
        e.preventDefault()
        const filteredItems = cartItems.filter((i) => i.id !== id)
        setCartItems(filteredItems)
        toast({
            variant: "destructive",
            title: "Премахване от поръчка",
            description: `Продуктът ${name} е успешно премахнат от вашата поръчка!`,
        })
    }

    return (
        <div className='relative w-full'>
            <div className='flex items-center justify-between'>
                <h1 className='text-base'>{name}</h1>
                <div
                    className='rotate-45 cursor-pointer'
                    onClick={handleRemoveFromCart}
                >
                    <IconPlus color='#fff' />
                </div>
            </div>

            <p className='w-52 truncate text-sm text-lightGray'>{description}</p>
            <div className='flex h-10 w-full items-center justify-between gap-2 rounded-lg text-lg'>
                <div className='flex gap-2'>
                    <p className='font-bold'>{price}лв </p>
                    <p className='text-lightGray'>x{quantity}</p>
                </div>
                <QuantityControl
                    tempQuantity={tempQuantity}
                    quantity={quantity}
                    increment={increment}
                    decrement={decrement}
                    id={id}
                    source='cart'
                />
            </div>
        </div>
    )
}

export default CartItem
