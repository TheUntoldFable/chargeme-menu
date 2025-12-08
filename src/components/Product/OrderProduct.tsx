"use client"

import QuantityControl from "@/components/common/QuantityControl"
import { OrderProductProps } from "@/models/product"
import { useCartStore } from "@/store/cart"
import { useTranslations } from "next-intl"
import React from "react"
import IconPlus from "../../../public/svg/icons/IconPlus"
import { toast } from "../ui/use-toast"

const OrderProduct = ({ name, id, tempQuantity, quantity, description, price, priceInEur, increment, decrement }: OrderProductProps) => {
    const { items: cartItems, setItems: setCartItems } = useCartStore()
    const t = useTranslations("cart.removeFromCart")

    const handleRemoveFromCart = (e: React.MouseEvent) => {
        e.preventDefault()
        const filteredItems = cartItems.filter((i) => i.id !== id)
        setCartItems(filteredItems)
        toast({
            variant: "destructive",
            title: t("title"),
            description: t("description", { name }),
        })
    }

    return (
        <div className='relative w-full'>
            <div
                className='absolute top-0 -right-1.5 rotate-45 cursor-pointer'
                onClick={handleRemoveFromCart}
            >
                <IconPlus color='#fff' />
            </div>
            <div>
                <h1 className='text-base'>{name}</h1>
                <p className='text-lightGray w-52 truncate text-sm'>{description}</p>
                <div className='flex h-10 w-full items-center justify-between gap-2 rounded-lg text-lg'>
                    <div className='flex gap-2'>
                        <p className='font-bold'>
                            {price.toFixed(2)} лв{typeof priceInEur === "number" ? ` / €${priceInEur.toFixed(2)}` : ""}
                        </p>
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
        </div>
    )
}

export default OrderProduct
