"use client"

import { useToast } from "@/components/ui/use-toast"
import { Product } from "@/models/product"
import { cartState } from "@/store/cart"
import { LegacyRef, forwardRef, useState } from "react"
import { useRecoilState } from "recoil"
import { Button } from "../ui/button"

interface AddProductProps {
    itemData: Product
    classNames?: string
    isWine: boolean
}

const AddProduct = ({ itemData, isWine }: AddProductProps, ref: LegacyRef<HTMLDivElement> | undefined) => {
    const { toast } = useToast()
    const [cartItems, setCartItems] = useRecoilState(cartState)
    const [isAddBtnActive, setIsAddBtnActive] = useState(false)
    if (!itemData) return null

    const { title, price, weight, id, desc } = itemData

    const isInCart = cartItems.find((c) => c.id === id)

    const handleAddToCart = () => {
        setIsAddBtnActive(true)
        setCartItems([...cartItems, { ...itemData, isSelected: true, quantity: 1 }])
        toast({
            variant: "default",
            title: "Добавяне в количка",
            description: `Продуктът ${title} е успешно добавен във вашата количка!`,
        })

        setTimeout(() => {
            setIsAddBtnActive(false)
        }, 2000)
    }

    return (
        <>
            <div>
                <h1 className='text-base'>{title}</h1>
                <p className='w-52 truncate text-sm text-lightGray'>{desc}</p>
                <div className='flex gap-2'>
                    <p className='font-bold'>{price}лв</p>
                    <span className='text-white'>|</span>
                    <p className='text-lightGray'>{weight}гр.</p>
                </div>
            </div>
            <Button
                className={`${isAddBtnActive ? "active" : ""} btn-check icon-container c-button-reset c-plus-to-check h-9 w-9 gap-2 rounded-full p-0 text-lg ${isWine ? "bg-wine-default text-white" : "bg-lightGray text-black"}`}
                type='button'
                id='add'
                variant={isInCart ? "destructive" : "default"}
                onClick={handleAddToCart}
            ></Button>
        </>
    )
}

export default forwardRef(AddProduct)
