"use client"

import IconPlus from "#/public/svg/icons/IconPlus"
import QuantityControl from "@/components/common/QuantityControl"
import { OrderProductProps } from "@/models/product"
import { useCartStore } from "@/store/cart"
import { useTranslations } from "next-intl"
import React from "react"
import { toast } from "../ui/use-toast"

const CartItem = ({ name, id, tempQuantity, quantity, description, priceInBgn, priceInEur, increment, decrement }: OrderProductProps) => {
    const { items: cartItems, setItems: setCartItems } = useCartStore()
    const tCart = useTranslations("cart")

    const handleRemoveFromCart = (e: React.MouseEvent) => {
        e.preventDefault()
        const filteredItems = cartItems.filter((i) => i.id !== id)
        setCartItems(filteredItems)
        toast({
            variant: "destructive",
            title: tCart("removeItem.title"),
            description: tCart("removeItem.description"),
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

            <p className='text-lightGray w-52 truncate text-sm'>{description}</p>
            <div className='flex h-10 w-full items-center justify-between gap-2 rounded-lg text-lg'>
                <div className='flex gap-2'>
                    <p className='text-sm font-bold'>
                        {priceInBgn}лв {priceInEur && <span className='text-lightGray'>/ €{priceInEur.toFixed(2)}</span>}
                    </p>
                    <p className='text-lightGray text-sm'>x{quantity}</p>
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
